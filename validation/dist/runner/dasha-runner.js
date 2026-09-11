import { generateMahadashas, getCurrentDasha } from '@vedica/dasha-engine';
export function runDashaBenchmark(testCase) {
    if (!testCase.expected || testCase.status === 'NOT_VALIDATED') {
        return {
            caseId: testCase.id,
            passed: true,
            status: 'NOT_VALIDATED',
            details: 'Awaiting verified Dasha benchmark data',
        };
    }
    const birthDate = new Date(testCase.input.birthInstant);
    const result = generateMahadashas({
        birthInstant: birthDate,
        moonLongitude: testCase.input.moonLongitude,
    });
    const testDate = new Date(testCase.testInstant);
    const current = getCurrentDasha({
        mahadashas: result.mahadashas,
        instant: testDate,
    });
    const passed = current.mahadasha?.lord === testCase.expected.currentMahadasha &&
        current.antardasha?.lord === testCase.expected.currentAntardasha &&
        current.pratyantardasha?.lord === testCase.expected.currentPratyantardasha;
    return {
        caseId: testCase.id,
        passed,
        status: passed ? 'PASS' : 'FAIL',
        actual: {
            mahadasha: current.mahadasha?.lord,
            antardasha: current.antardasha?.lord,
            pratyantardasha: current.pratyantardasha?.lord,
        },
        expected: testCase.expected,
    };
}
export function verifyDashaBoundaryContinuity(moonLongitude, birthInstant) {
    const result = generateMahadashas({
        birthInstant,
        moonLongitude,
    });
    const checks = [];
    // Check Mahadasha continuity
    for (let i = 0; i < result.mahadashas.length; i++) {
        const md = result.mahadashas[i];
        const startTime = md.start.getTime();
        const endTime = md.end.getTime();
        if (startTime >= endTime) {
            checks.push({
                description: `Mahadasha ${md.lord} start < end`,
                passed: false,
                details: `start: ${md.start.toISOString()}, end: ${md.end.toISOString()}`,
            });
        }
        if (i < result.mahadashas.length - 1) {
            const nextMd = result.mahadashas[i + 1];
            const nextStartTime = nextMd.start.getTime();
            const exactMatch = endTime === nextStartTime;
            checks.push({
                description: `Mahadasha [${md.lord}] end matches [${nextMd.lord}] start`,
                passed: exactMatch,
                details: `end: ${md.end.toISOString()}, nextStart: ${nextMd.start.toISOString()}`,
            });
        }
        // Check Antardasha continuity
        if (md.children && md.children.length > 0) {
            for (let j = 0; j < md.children.length; j++) {
                const ad = md.children[j];
                const adStart = ad.start.getTime();
                const adEnd = ad.end.getTime();
                if (adStart >= adEnd) {
                    checks.push({
                        description: `Antardasha ${md.lord}-${ad.lord} start < end`,
                        passed: false,
                    });
                }
                if (j < md.children.length - 1) {
                    const nextAd = md.children[j + 1];
                    const nextAdStart = nextAd.start.getTime();
                    checks.push({
                        description: `Antardasha [${ad.lord}] end matches [${nextAd.lord}] start`,
                        passed: adEnd === nextAdStart,
                    });
                }
            }
        }
    }
    // Check 1ms boundary behavior
    const firstMd = result.mahadashas[0];
    const endFirstMdDate = new Date(firstMd.end.getTime());
    const oneMsBefore = new Date(endFirstMdDate.getTime() - 1);
    const dashaBefore = getCurrentDasha({
        mahadashas: result.mahadashas,
        instant: oneMsBefore,
    });
    const dashaAtBoundary = getCurrentDasha({
        mahadashas: result.mahadashas,
        instant: endFirstMdDate,
    });
    checks.push({
        description: '1ms before boundary resolves to previous Mahadasha',
        passed: dashaBefore.mahadasha?.lord === firstMd.lord,
    });
    checks.push({
        description: 'Exact boundary instant resolves to next Mahadasha',
        passed: dashaAtBoundary.mahadasha?.lord === result.mahadashas[1].lord,
    });
    const allPassed = checks.every((c) => c.passed);
    return {
        passed: allPassed,
        checks,
    };
}
//# sourceMappingURL=dasha-runner.js.map