export function runShadbalaBenchmark(testCase, shadbalaResult) {
    const results = [];
    const ref = testCase.referenceValues?.shadbala;
    if (!ref) {
        return results; // No reference data
    }
    const compareSection = (sectionRef, sectionResult, sectionName) => {
        if (!sectionRef || !sectionResult)
            return;
        for (const [planetName, expectedValue] of Object.entries(sectionRef)) {
            const actualValue = sectionResult[planetName];
            if (actualValue !== undefined) {
                // Tolerance for shadbala virupas is usually 0.5 or 1
                const diff = Math.abs(expectedValue - actualValue);
                const passed = diff <= 0.5;
                results.push({
                    planetOrKey: `${sectionName} ${planetName}`,
                    field: 'Virupa',
                    expectedValue,
                    actualValue,
                    difference: diff,
                    tolerance: 0.5,
                    passed
                });
            }
            else {
                results.push({
                    planetOrKey: `${sectionName} ${planetName}`,
                    field: 'Virupa',
                    expectedValue,
                    actualValue: 'Missing',
                    passed: false,
                    notes: 'PARTIAL_IMPLEMENTATION'
                });
            }
        }
    };
    const extractComponent = (componentName) => {
        const map = {};
        for (const p of shadbalaResult.planets) {
            if (p.components[componentName]) {
                map[p.planet] = p.components[componentName].virupas;
            }
        }
        return map;
    };
    const extractSaptavarga = () => {
        const map = {};
        for (const p of shadbalaResult.planets) {
            if (p.components.sthana?.subcomponents?.SAPTAVARGAJA_BALA) {
                map[p.planet] = p.components.sthana.subcomponents.SAPTAVARGAJA_BALA.virupas;
            }
        }
        return map;
    };
    const extractTotal = () => {
        const map = {};
        for (const p of shadbalaResult.planets) {
            map[p.planet] = p.partialTotalVirupas; // Using partial total as total is incomplete
        }
        return map;
    };
    compareSection(ref.saptavarga, extractSaptavarga(), 'Saptavargaja Bala');
    compareSection(ref.sthana, extractComponent('sthana'), 'Sthana Bala');
    compareSection(ref.dig, extractComponent('dig'), 'Dig Bala');
    compareSection(ref.naisargika, extractComponent('naisargika'), 'Naisargika Bala');
    compareSection(ref.cheshta, extractComponent('cheshta'), 'Cheshta Bala');
    compareSection(ref.total, extractTotal(), 'Total Shadbala');
    return results;
}
//# sourceMappingURL=shadbala-runner.js.map