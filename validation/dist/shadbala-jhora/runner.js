import { SwissEphemerisEngine } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { evaluateShadbalaEngine, PERSONAL_SHADBALA_V1 } from '@vedica/shadbala-engine';
import { DEFAULT_SHADBALA_TOLERANCE_POLICY, } from './shadbala-jhora-benchmark-schema.js';
export class ShadbalaBenchmarkRunner {
    engine;
    tolerancePolicy;
    constructor(tolerancePolicy = DEFAULT_SHADBALA_TOLERANCE_POLICY) {
        this.engine = new SwissEphemerisEngine();
        this.tolerancePolicy = tolerancePolicy;
    }
    async runBenchmarkCase(benchmarkCase) {
        const { birthDetails, expected } = benchmarkCase;
        if (!expected || Object.keys(expected).length === 0 || benchmarkCase.validationStatus === 'NOT_VALIDATED') {
            return {
                benchmarkId: benchmarkCase.id,
                description: benchmarkCase.description,
                validationStatus: 'NOT_VALIDATED',
                components: [],
                overallResult: 'NOT_VALIDATED',
            };
        }
        const chartInput = {
            birthTime: {
                dateOfBirth: birthDetails.date,
                timeOfBirth: birthDetails.time,
                timezone: birthDetails.timezone,
            },
            location: {
                name: birthDetails.location,
                latitude: birthDetails.latitude,
                longitude: birthDetails.longitude,
                timezone: birthDetails.timezone,
            },
        };
        const chart = await this.engine.calculateBirthChart(chartInput);
        const analysis = analyzeChart(chart);
        const d9Chart = calculateDivisionalChart(chart, 'D9');
        const shadbalaResult = evaluateShadbalaEngine({ chart, analysis, d9Chart }, PERSONAL_SHADBALA_V1);
        const componentResults = [];
        let hasFailures = false;
        for (const [planetName, refValues] of Object.entries(expected)) {
            const planetShadbala = shadbalaResult.planets.find((p) => p.planet === planetName);
            if (!planetShadbala || !refValues)
                continue;
            const comparisons = [
                { component: 'UCHCHA_BALA', actual: planetShadbala.components.sthana?.subcomponents?.UCHCHA_BALA?.virupas, expected: refValues.uchchaBala },
                { component: 'OJAYUGMA_BALA', actual: planetShadbala.components.sthana?.subcomponents?.OJAYUGMA_BALA?.virupas, expected: refValues.ojayugmaBala },
                { component: 'KENDRADI_BALA', actual: planetShadbala.components.sthana?.subcomponents?.KENDRADI_BALA?.virupas, expected: refValues.kendradiBala },
                { component: 'DREKKANA_BALA', actual: planetShadbala.components.sthana?.subcomponents?.DREKKANA_BALA?.virupas, expected: refValues.drekkanaBala },
                { component: 'DIG_BALA', actual: planetShadbala.components.dig?.virupas, expected: refValues.digBala },
                { component: 'NAISARGIKA_BALA', actual: planetShadbala.components.naisargika?.virupas, expected: refValues.naisargikaBala },
            ];
            for (const comp of comparisons) {
                if (comp.expected === undefined)
                    continue;
                const tolerance = this.tolerancePolicy.componentOverrides[comp.component] ?? this.tolerancePolicy.defaultVirupaTolerance;
                const actualVal = comp.actual ?? 0;
                const diff = Math.abs(actualVal - comp.expected);
                const pass = diff <= tolerance;
                if (!pass)
                    hasFailures = true;
                componentResults.push({
                    planet: planetName,
                    component: comp.component,
                    expected: comp.expected,
                    actual: actualVal,
                    difference: diff,
                    tolerance,
                    result: pass ? 'PASS' : 'FAIL',
                });
            }
        }
        return {
            benchmarkId: benchmarkCase.id,
            description: benchmarkCase.description,
            validationStatus: hasFailures ? 'PARTIALLY_VALIDATED' : 'VALIDATED',
            components: componentResults,
            overallResult: hasFailures ? 'FAIL' : 'PASS',
        };
    }
}
//# sourceMappingURL=runner.js.map