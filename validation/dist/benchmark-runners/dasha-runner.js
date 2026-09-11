export function runDashaBenchmark(testCase, mahadashas, birthNakshatra) {
    const results = [];
    const ref = testCase.referenceValues?.dasha;
    if (!ref) {
        return results; // No reference data for dasha
    }
    // Birth Nakshatra
    if (ref.birthNakshatra !== undefined) {
        results.push({
            planetOrKey: 'Dasha',
            field: 'birthNakshatra',
            expectedValue: ref.birthNakshatra,
            actualValue: birthNakshatra || '',
            passed: birthNakshatra === ref.birthNakshatra
        });
    }
    // Mahadasha at Birth
    if (ref.mahadashaAtBirth !== undefined) {
        const actualMahadashaAtBirth = mahadashas.length > 0 ? mahadashas[0].lord : '';
        results.push({
            planetOrKey: 'Dasha',
            field: 'mahadashaAtBirth',
            expectedValue: ref.mahadashaAtBirth,
            actualValue: actualMahadashaAtBirth,
            passed: actualMahadashaAtBirth === ref.mahadashaAtBirth
        });
    }
    // Mahadashas Date Boundaries
    if (ref.mahadashas && Array.isArray(ref.mahadashas)) {
        ref.mahadashas.forEach((expectedMd, index) => {
            const actualMd = mahadashas.find((m) => m.lord === expectedMd.lord);
            if (actualMd) {
                if (expectedMd.start) {
                    const expectedStart = new Date(expectedMd.start).getTime();
                    const actualStart = actualMd.start.getTime();
                    // 24 hour tolerance = 86400000 ms
                    const toleranceMs = 86400000;
                    const diff = Math.abs(expectedStart - actualStart);
                    results.push({
                        planetOrKey: `Mahadasha ${expectedMd.lord}`,
                        field: 'startDate',
                        expectedValue: new Date(expectedStart).toISOString().split('T')[0],
                        actualValue: new Date(actualStart).toISOString().split('T')[0],
                        difference: diff / (1000 * 60 * 60 * 24), // difference in days
                        tolerance: 1, // 1 day
                        passed: diff <= toleranceMs
                    });
                }
            }
            else {
                results.push({
                    planetOrKey: `Mahadasha ${expectedMd.lord}`,
                    field: 'existence',
                    expectedValue: 'Exists',
                    actualValue: 'Missing',
                    passed: false
                });
            }
        });
    }
    return results;
}
//# sourceMappingURL=dasha-runner.js.map