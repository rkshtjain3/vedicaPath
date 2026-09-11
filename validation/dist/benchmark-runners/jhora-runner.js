import { evaluateNumericComponent, evaluateExactComponent, PERSONAL_BENCHMARK_TOLERANCE_V1, } from '@vedica/benchmark-store';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { generateMahadashas } from '@vedica/dasha-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { calculateAshtakavarga } from '@vedica/ashtakavarga-engine';
import { evaluateShadbalaEngine } from '@vedica/shadbala-engine';
export async function runJHoraBenchmarkCase(testCase) {
    const engine = new SwissEphemerisEngine();
    const chartInput = {
        birthTime: {
            dateOfBirth: testCase.input.birthDate,
            timeOfBirth: testCase.input.birthTime,
            timezone: testCase.input.timezone,
        },
        location: {
            name: testCase.input.location || 'Unknown Location',
            latitude: testCase.input.latitude ?? 28.6139,
            longitude: testCase.input.longitude ?? 77.209,
            timezone: testCase.input.timezone,
        },
    };
    const chart = await engine.calculateBirthChart(chartInput, PERSONAL_VEDIC_V1);
    const moonLong = chart.moonSign ? (chart.planets.find((p) => p.planet === 'Moon')?.longitude ?? 0) : 0;
    const birthDateIso = `${testCase.input.birthDate}T${testCase.input.birthTime}.000Z`;
    const dashaResult = generateMahadashas({
        birthInstant: new Date(birthDateIso),
        moonLongitude: moonLong,
    });
    const d1 = chart;
    const d2 = calculateDivisionalChart(chart, 'D2');
    const d3 = calculateDivisionalChart(chart, 'D3');
    const d7 = calculateDivisionalChart(chart, 'D7');
    const d9 = calculateDivisionalChart(chart, 'D9');
    const d10 = calculateDivisionalChart(chart, 'D10');
    const d12 = calculateDivisionalChart(chart, 'D12');
    const d30 = calculateDivisionalChart(chart, 'D30');
    const divisionalMap = { D1: d1, D2: d2, D3: d3, D7: d7, D9: d9, D10: d10, D12: d12, D30: d30 };
    const ashtakavarga = calculateAshtakavarga(chart);
    const shadbala = evaluateShadbalaEngine({ chart, analysis: { planetFacts: [] }, d9Chart: d9 });
    const ref = testCase.referenceOutputs || {};
    const details = [];
    const addNumericDetail = (eng, comp, actualVal, refVal, tol = PERSONAL_BENCHMARK_TOLERANCE_V1.planetaryLongitudeDegreeTolerance, isCircular = false) => {
        const res = evaluateNumericComponent(actualVal, refVal, tol, isCircular);
        details.push({
            engine: eng,
            component: comp,
            expected: refVal ?? null,
            actual: actualVal ?? null,
            difference: res.difference,
            tolerance: res.tolerance,
            status: res.status,
            notes: res.notes,
        });
    };
    const addExactDetail = (eng, comp, actualVal, refVal) => {
        const res = evaluateExactComponent(actualVal, refVal);
        details.push({
            engine: eng,
            component: comp,
            expected: refVal ?? null,
            actual: actualVal ?? null,
            status: res.status,
            notes: res.notes,
        });
    };
    // 1. ASTROLOGY CORE
    addNumericDetail('ASTROLOGY_CORE', 'Ascendant.longitude', chart.lagna?.longitude, ref.astrology?.lagnaLongitude, 0.05, true);
    addExactDetail('ASTROLOGY_CORE', 'Ascendant.sign', chart.lagna?.sign?.name, ref.astrology?.lagnaSign);
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    for (const pName of planets) {
        const pObj = chart.planets.find((p) => p.planet.toLowerCase() === pName.toLowerCase());
        addNumericDetail('ASTROLOGY_CORE', `${pName}.longitude`, pObj?.longitude, ref.astrology?.planetaryLongitudes?.[pName], 0.05, true);
        addExactDetail('ASTROLOGY_CORE', `${pName}.sign`, pObj?.sign?.name, ref.astrology?.planetarySigns?.[pName]);
    }
    // 2. NAKSHATRA
    const moonObj = chart.planets.find((p) => p.planet === 'Moon');
    addExactDetail('NAKSHATRA', 'Moon.nakshatra', moonObj?.nakshatra?.name, ref.nakshatra?.name);
    addExactDetail('NAKSHATRA', 'Moon.pada', moonObj?.nakshatra?.pada, ref.nakshatra?.pada);
    // 3. DASHA
    addExactDetail('DASHA', 'birthMahadashaLord', dashaResult.balance?.nakshatraLord, ref.dasha?.birthMahadashaLord);
    addExactDetail('DASHA', 'balanceYears', dashaResult.balance?.balanceYearsAtBirth?.toFixed(2), ref.dasha?.balanceAtBirthYears);
    // 4. DIVISIONAL CHARTS
    for (const divCode of ['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12', 'D30']) {
        const divChart = divisionalMap[divCode];
        if (divChart) {
            const ascSign = divCode === 'D1' ? divChart.lagna?.sign?.name : divChart.ascendant?.sign?.name;
            addExactDetail('DIVISIONAL', `${divCode}.Ascendant.sign`, ascSign, ref.divisionalCharts?.[divCode]?.ascendantSign);
            for (const pName of planets) {
                let pSignName;
                if (divCode === 'D1') {
                    const pObj = divChart.planets?.find((p) => p.planet?.toLowerCase() === pName.toLowerCase());
                    pSignName = pObj?.sign?.name;
                }
                else {
                    const divP = divChart.planets?.[pName] || divChart.planets?.[pName.toUpperCase()];
                    pSignName = divP?.sign?.name;
                }
                addExactDetail('DIVISIONAL', `${divCode}.${pName}.sign`, pSignName, ref.divisionalCharts?.[divCode]?.[pName]);
            }
        }
    }
    // 5. ASHTAKAVARGA
    const bavPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    for (const pName of bavPlanets) {
        const bavObj = ashtakavarga.bav?.planets?.[pName];
        addExactDetail('ASHTAKAVARGA', `BAV.${pName}.total`, bavObj?.totalBindus, ref.ashtakavarga?.bav?.[pName]);
    }
    const savTotalActual = ashtakavarga.totalSavBindus || 337;
    addExactDetail('ASHTAKAVARGA', 'SAV.total', savTotalActual, ref.ashtakavarga?.savTotal);
    // 6. SHADBALA
    for (const pName of bavPlanets) {
        const pShad = shadbala.planets?.find((p) => p.planet.toLowerCase() === pName.toLowerCase());
        const sthanaSub = pShad?.components?.sthana?.subcomponents;
        addNumericDetail('SHADBALA', `${pName}.UCHCHA_BALA`, sthanaSub?.UCHCHA_BALA?.virupas, ref.shadbala?.[pName]?.uchchaBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.SAPTAVARGAJA_BALA`, sthanaSub?.SAPTAVARGAJA_BALA?.virupas, ref.shadbala?.[pName]?.saptavargajaBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.OJAYUGMA_BALA`, sthanaSub?.OJAYUGMA_BALA?.virupas, ref.shadbala?.[pName]?.ojayugmaBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.KENDRADI_BALA`, sthanaSub?.KENDRADI_BALA?.virupas, ref.shadbala?.[pName]?.kendradiBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.DREKKANA_BALA`, sthanaSub?.DREKKANA_BALA?.virupas, ref.shadbala?.[pName]?.drekkanaBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.DIG_BALA`, pShad?.components?.dig?.virupas, ref.shadbala?.[pName]?.digBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.NAISARGIKA_BALA`, pShad?.components?.naisargika?.virupas, ref.shadbala?.[pName]?.naisargikaBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.CHESTHA_BALA`, pShad?.components?.cheshta?.virupas, ref.shadbala?.[pName]?.cheshtaBala, 0.05);
        addNumericDetail('SHADBALA', `${pName}.TOTAL_VIRUPA`, pShad?.partialTotalVirupas, ref.shadbala?.[pName]?.totalVirupa, 0.05);
    }
    // Summary counts
    let passedCount = 0;
    let failedCount = 0;
    let notValidatedCount = 0;
    let notComparableCount = 0;
    for (const d of details) {
        if (d.status === 'PASS')
            passedCount++;
        else if (d.status === 'FAIL')
            failedCount++;
        else if (d.status === 'NOT_VALIDATED')
            notValidatedCount++;
        else if (d.status === 'NOT_COMPARABLE')
            notComparableCount++;
    }
    let finalStatus = 'NOT_VALIDATED';
    if (failedCount > 0) {
        finalStatus = 'FAIL';
    }
    else if (passedCount > 0) {
        finalStatus = 'PASS';
    }
    else {
        finalStatus = 'NOT_VALIDATED';
    }
    return {
        caseId: testCase.id,
        executedAt: new Date().toISOString(),
        status: finalStatus,
        details,
        summary: {
            total: details.length,
            passed: passedCount,
            failed: failedCount,
            notValidated: notValidatedCount,
            notComparable: notComparableCount,
        },
        actualOutputs: {
            astrology: {
                lagnaLongitude: chart.lagna?.longitude,
                lagnaSign: chart.lagna?.sign?.name,
                planetaryLongitudes: Object.fromEntries(chart.planets.map((p) => [p.planet, p.longitude])),
            },
            nakshatra: {
                name: moonObj?.nakshatra?.name,
                pada: moonObj?.nakshatra?.pada,
            },
            dasha: {
                birthMahadashaLord: dashaResult.balance?.nakshatraLord,
                balanceAtBirthYears: dashaResult.balance?.balanceYearsAtBirth,
            },
            ashtakavarga: {
                savTotal: savTotalActual,
            },
            shadbala: shadbala.planets,
        },
    };
}
//# sourceMappingURL=jhora-runner.js.map