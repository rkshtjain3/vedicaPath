export function runDivisionalBenchmark(testCase, d9, d10) {
    const results = [];
    const ref = testCase.referenceValues?.divisionalCharts;
    if (!ref) {
        return results; // No reference data
    }
    // Helper to validate a divisional chart
    const validateChart = (chartRef, chart, chartName) => {
        if (!chartRef || !chart)
            return;
        if (chartRef.lagnaSign !== undefined) {
            const actualLagnaSign = chart.ascendant?.sign?.name;
            results.push({
                planetOrKey: `${chartName} Lagna`,
                field: 'sign',
                expectedValue: chartRef.lagnaSign,
                actualValue: actualLagnaSign || '',
                passed: actualLagnaSign === chartRef.lagnaSign
            });
        }
        if (chartRef.planetarySigns) {
            for (const [planetName, expectedSign] of Object.entries(chartRef.planetarySigns)) {
                const planet = chart.planets[planetName];
                if (planet) {
                    const actualSign = planet.sign?.name || '';
                    results.push({
                        planetOrKey: `${chartName} ${planetName}`,
                        field: 'sign',
                        expectedValue: expectedSign,
                        actualValue: actualSign,
                        passed: actualSign === expectedSign
                    });
                }
            }
        }
    };
    validateChart(ref.d9, d9, 'D9');
    validateChart(ref.d10, d10, 'D10');
    return results;
}
//# sourceMappingURL=divisional-runner.js.map