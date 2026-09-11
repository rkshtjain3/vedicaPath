import crypto from 'node:crypto';
export function computeInputFingerprint(snapshot) {
    const normalized = {
        birthDate: snapshot.birthDate,
        birthTime: snapshot.birthTime,
        timezone: snapshot.timezone,
        utcInstant: snapshot.utcInstant,
        latitude: snapshot.latitude,
        longitude: snapshot.longitude,
        locationName: snapshot.locationName,
        country: snapshot.country || '',
        dstSelection: snapshot.dstSelection || '',
        calculationProfileVersion: snapshot.calculationProfileVersion,
        ayanamsha: snapshot.ayanamsha || '',
        houseSystem: snapshot.houseSystem || '',
    };
    const str = JSON.stringify(normalized);
    return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}
export function detectInputDrift(benchmarkCase, currentProfileVersion) {
    const currentFingerprint = computeInputFingerprint(benchmarkCase.inputSnapshot);
    const storedFingerprint = benchmarkCase.inputFingerprint;
    const storedProfileVersion = benchmarkCase.calculationProfileVersion;
    const activeProfileVersion = currentProfileVersion || storedProfileVersion;
    let driftStatus = 'MATCH';
    let details = 'Calculation inputs and profile configuration match stored snapshot.';
    if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        driftStatus = 'INPUT_CHANGED';
        details = `Input fingerprint mismatch: expected ${storedFingerprint}, got ${currentFingerprint}`;
    }
    else if (storedProfileVersion && activeProfileVersion !== storedProfileVersion) {
        driftStatus = 'PROFILE_CHANGED';
        details = `Profile version mismatch: case profile ${storedProfileVersion}, active profile ${activeProfileVersion}`;
    }
    return {
        driftStatus,
        storedFingerprint,
        currentFingerprint,
        storedProfileVersion,
        currentProfileVersion: activeProfileVersion,
        details,
    };
}
export class BenchmarkService {
    static async runBenchmark(params) {
        const { benchmarkId, store, currentProfileVersion, calculate, compare } = params;
        const benchmarkCase = await store.getCase(benchmarkId);
        if (!benchmarkCase) {
            throw new Error(`Benchmark case "${benchmarkId}" not found in BenchmarkStore.`);
        }
        const driftResult = detectInputDrift(benchmarkCase, currentProfileVersion);
        // Run engine calculation callback using the immutable input snapshot
        const actualOutput = await calculate(benchmarkCase.inputSnapshot);
        const hasReferenceValues = Object.keys(benchmarkCase.referenceValues || {}).length > 0;
        let comparisonResults = [];
        let status = 'NOT_VALIDATED';
        if (!hasReferenceValues) {
            status = 'NOT_VALIDATED';
        }
        else if (driftResult.driftStatus !== 'MATCH') {
            status = 'STALE';
            comparisonResults = compare(actualOutput, benchmarkCase.referenceValues);
        }
        else {
            comparisonResults = compare(actualOutput, benchmarkCase.referenceValues);
            const allPassed = comparisonResults.length > 0 && comparisonResults.every((c) => c.passed);
            status = allPassed ? 'PASS' : 'FAIL';
        }
        const totalComponents = comparisonResults.length;
        const passedComponents = comparisonResults.filter((c) => c.passed).length;
        const failedComponents = comparisonResults.filter((c) => !c.passed).length;
        const unvalidatedComponents = hasReferenceValues ? 0 : totalComponents;
        const executedAt = new Date().toISOString();
        const resultRecord = {
            id: `RES-${benchmarkCase.id}-${Date.now()}`,
            caseId: benchmarkCase.id,
            executedAt,
            status,
            driftResult,
            comparisonResults,
            calculationOutputSnapshot: actualOutput && typeof actualOutput === 'object' ? actualOutput : { output: actualOutput },
            summary: {
                totalComponents,
                passedComponents,
                failedComponents,
                unvalidatedComponents,
            },
        };
        await store.saveResult(resultRecord);
        return {
            benchmarkCase,
            executedAt,
            status,
            driftResult,
            comparisonResults,
            summary: {
                totalComponents,
                passedComponents,
                failedComponents,
                unvalidatedComponents,
            },
        };
    }
}
//# sourceMappingURL=benchmark-service.js.map