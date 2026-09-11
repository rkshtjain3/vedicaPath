import { calculateReferenceCompleteness, } from '@vedica/benchmark-store';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { generateMahadashas } from '@vedica/dasha-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { classifyMismatch } from './mismatch-classifier.js';
export function computeCircularAngularDifference(deg1, deg2) {
    const diff = Math.abs((deg1 % 360) - (deg2 % 360));
    return Math.min(diff, 360 - diff);
}
export function calculateMedian(numbers) {
    if (numbers.length === 0)
        return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
        return sorted[mid];
    }
    return (sorted[mid - 1] + sorted[mid]) / 2;
}
export function calculateRMS(numbers) {
    if (numbers.length === 0)
        return 0;
    const squareSum = numbers.reduce((sum, val) => sum + val * val, 0);
    return Math.sqrt(squareSum / numbers.length);
}
export async function runBirthChartBenchmark(testCase, tolerance = 0.05, targetSoftware) {
    const engine = new SwissEphemerisEngine();
    // Select target reference (multiReference entry vs default referenceValues)
    let refSource = testCase.referenceSource;
    let refValues = testCase.referenceValues || {};
    if (targetSoftware && testCase.multiReferences && testCase.multiReferences.length > 0) {
        const matched = testCase.multiReferences.find((m) => m.sourceSoftware.toLowerCase() === targetSoftware.toLowerCase());
        if (matched) {
            refValues = matched.values;
            refSource = {
                ...testCase.referenceSource,
                software: matched.sourceSoftware,
                version: matched.sourceVersion,
                sourceSoftware: matched.sourceSoftware,
                sourceVersion: matched.sourceVersion,
                verificationStatus: matched.verificationStatus,
                sourceConfiguration: matched.sourceConfiguration,
            };
        }
    }
    const completeness = calculateReferenceCompleteness(refValues);
    const referenceCoverageStatus = completeness.status;
    const verificationStatus = refSource?.verificationStatus || 'UNVERIFIED';
    const birthInput = {
        birthTime: {
            dateOfBirth: testCase.inputSnapshot.birthDate,
            timeOfBirth: testCase.inputSnapshot.birthTime,
            timezone: testCase.inputSnapshot.timezone,
        },
        location: {
            name: testCase.inputSnapshot.locationName || 'Location',
            latitude: testCase.inputSnapshot.latitude,
            longitude: testCase.inputSnapshot.longitude,
            timezone: testCase.inputSnapshot.timezone,
        },
    };
    const chart = await engine.calculateBirthChart(birthInput, PERSONAL_VEDIC_V1);
    const moonObj = chart.planets.find((p) => p.planet === 'Moon');
    const moonLong = moonObj?.longitude ?? 0;
    const birthDateIso = `${testCase.inputSnapshot.birthDate}T${testCase.inputSnapshot.birthTime}.000Z`;
    const dashaResult = generateMahadashas({
        birthInstant: new Date(birthDateIso),
        moonLongitude: moonLong,
    });
    const divisionalCharts = {
        D1: chart,
        D2: calculateDivisionalChart(chart, 'D2'),
        D3: calculateDivisionalChart(chart, 'D3'),
        D7: calculateDivisionalChart(chart, 'D7'),
        D9: calculateDivisionalChart(chart, 'D9'),
        D10: calculateDivisionalChart(chart, 'D10'),
        D12: calculateDivisionalChart(chart, 'D12'),
        D30: calculateDivisionalChart(chart, 'D30'),
    };
    // Check Configuration Compatibility
    const refSourceSettings = refSource?.settings || refSource?.sourceConfiguration || {};
    const currentAyanamsha = (testCase.inputSnapshot.ayanamsha || 'Lahiri').toLowerCase();
    const refAyanamsha = (refSourceSettings.ayanamsha || refSourceSettings.ayanamsa || 'Lahiri').toLowerCase();
    let isConfigIncompatible = false;
    let configurationMismatchNote;
    if (refAyanamsha && refAyanamsha !== currentAyanamsha) {
        isConfigIncompatible = true;
        configurationMismatchNote = `Configuration Mismatch: Reference ayanamsha '${refAyanamsha}' conflicts with engine ayanamsha '${currentAyanamsha}'. Results marked INCOMPARABLE_CONFIGURATION.`;
    }
    const ref = (refValues || {});
    const details = [];
    const planetaryAngularDiffs = [];
    // Helper for angular comparison
    const evaluateAngular = (cat, key, field, actualVal, expectedVal) => {
        if (expectedVal === undefined || expectedVal === null) {
            details.push({
                category: cat,
                planetOrKey: key,
                field,
                expectedValue: 'NOT_ENTERED',
                actualValue: actualVal ?? 0,
                passed: false,
                status: 'NOT_VALIDATED',
                notes: 'Reference value not provided',
            });
            return;
        }
        const diff = computeCircularAngularDifference(actualVal ?? 0, expectedVal);
        if (cat === 'PLANET_LONGITUDE' || cat === 'ASCENDANT') {
            planetaryAngularDiffs.push(diff);
        }
        const degInSign = (actualVal ?? 0) % 30;
        const isBoundary = degInSign < 0.005 || degInSign > 29.995;
        const passed = diff <= tolerance;
        const item = {
            category: cat,
            planetOrKey: key,
            field,
            expectedValue: expectedVal,
            actualValue: actualVal ?? 0,
            difference: diff,
            tolerance,
            passed,
            status: passed ? 'PASS' : 'FAIL',
            boundarySensitive: isBoundary,
        };
        if (!passed && isBoundary) {
            item.mismatchType = 'BOUNDARY_REFERENCE_PRECISION';
        }
        details.push(item);
    };
    // Helper for exact string/number comparison
    const evaluateExact = (cat, key, field, actualVal, expectedVal) => {
        if (expectedVal === undefined || expectedVal === null) {
            details.push({
                category: cat,
                planetOrKey: key,
                field,
                expectedValue: 'NOT_ENTERED',
                actualValue: actualVal ?? '',
                passed: false,
                status: 'NOT_VALIDATED',
                notes: 'Reference value not provided',
            });
            return;
        }
        const passed = String(actualVal) === String(expectedVal);
        details.push({
            category: cat,
            planetOrKey: key,
            field,
            expectedValue: expectedVal,
            actualValue: actualVal ?? '',
            passed,
            status: passed ? 'PASS' : 'FAIL',
        });
    };
    // 1. Ascendant
    const astRef = ref.astrology || ref;
    evaluateAngular('ASCENDANT', 'Ascendant', 'longitude', chart.lagna?.longitude, astRef.ascendantLongitude ?? astRef.lagnaLongitude);
    evaluateExact('ASCENDANT', 'Ascendant', 'sign', chart.lagna?.sign?.name, astRef.ascendantSign ?? astRef.lagnaSign);
    // 2. Planets
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    for (const pName of planetNames) {
        const pObj = chart.planets.find((p) => p.planet.toLowerCase() === pName.toLowerCase());
        const refLng = astRef.planetaryLongitudes?.[pName] ?? (astRef[pName.toLowerCase()]?.longitude);
        const refSign = astRef.planetarySigns?.[pName] ?? (astRef[pName.toLowerCase()]?.sign);
        evaluateAngular('PLANET_LONGITUDE', pName, 'longitude', pObj?.longitude, typeof refLng === 'number' ? refLng : refLng?.longitude);
        evaluateExact('SIGN', pName, 'sign', pObj?.sign?.name, typeof refSign === 'string' ? refSign : refLng?.sign);
        // Nakshatra & Pada
        const nakRef = ref.nakshatras?.[pName] ?? astRef.nakshatras?.[pName];
        const padaRef = ref.padas?.[pName] ?? astRef.padas?.[pName];
        evaluateExact('NAKSHATRA', pName, 'nakshatra', pObj?.nakshatra?.name, nakRef);
        evaluateExact('NAKSHATRA', pName, 'pada', pObj?.nakshatra?.pada, padaRef);
    }
    // 3. Dasha Validation
    const dashaRef = ref.dasha || {};
    evaluateExact('DASHA', 'Dasha', 'birthNakshatra', moonObj?.nakshatra?.name, dashaRef.birthNakshatra);
    evaluateExact('DASHA', 'Dasha', 'dashaStartingLord', dashaResult.balance?.nakshatraLord, dashaRef.dashaStartingLord ?? dashaRef.mahadashaAtBirth);
    evaluateExact('DASHA', 'Dasha', 'balanceYearsAtBirth', dashaResult.balance?.balanceYearsAtBirth?.toFixed(2), dashaRef.balanceYearsAtBirth ?? dashaRef.balanceAtBirthYears);
    // 4. Divisional Charts Validation
    const divRef = ref.divisionalCharts || {};
    const divMatrix = {};
    for (const divCode of ['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12', 'D30']) {
        const divChart = divisionalCharts[divCode];
        const targetRef = divRef[divCode] ?? divRef[divCode.toLowerCase()];
        let divTotal = 0;
        let divPassed = 0;
        let divFailed = 0;
        if (divChart && targetRef) {
            for (const pName of planetNames) {
                const divP = divCode === 'D1'
                    ? divChart.planets?.find((p) => p.planet?.toLowerCase() === pName.toLowerCase())
                    : (divChart.planets?.[pName] || divChart.planets?.[pName.toUpperCase()]);
                const expectedSign = typeof targetRef[pName] === 'string' ? targetRef[pName] : targetRef[pName]?.sign;
                const actualSign = divP?.sign?.name;
                if (expectedSign !== undefined && expectedSign !== null) {
                    divTotal++;
                    const passed = String(actualSign) === String(expectedSign);
                    if (passed)
                        divPassed++;
                    else
                        divFailed++;
                    const d1Detail = details.find((d) => d.planetOrKey === pName && d.field === 'longitude');
                    const d1Passed = d1Detail ? d1Detail.passed : true;
                    const detailItem = {
                        category: 'DIVISIONAL',
                        planetOrKey: `${divCode}.${pName}`,
                        field: 'sign',
                        expectedValue: expectedSign,
                        actualValue: actualSign ?? '',
                        passed,
                        status: passed ? 'PASS' : 'FAIL',
                    };
                    if (!passed) {
                        detailItem.mismatchType = d1Passed ? 'DIVISIONAL_MAPPING_ERROR' : 'BASE_LONGITUDE_ERROR';
                    }
                    details.push(detailItem);
                }
            }
        }
        divMatrix[divCode] = {
            total: divTotal,
            passed: divPassed,
            failed: divFailed,
            passRate: divTotal > 0 ? Math.round((divPassed / divTotal) * 100) : 0,
        };
    }
    // Summary counts
    let passedCount = 0;
    let failedCount = 0;
    let unvalidatedCount = 0;
    for (const d of details) {
        if (d.status === 'PASS')
            passedCount++;
        else if (d.status === 'FAIL')
            failedCount++;
        else if (d.status === 'NOT_VALIDATED')
            unvalidatedCount++;
    }
    let overallResult = 'NOT_VALIDATED';
    let validationExecutionResult = 'NOT_RUN';
    if (referenceCoverageStatus === 'NOT_AVAILABLE' && passedCount === 0 && failedCount === 0) {
        overallResult = 'NOT_VALIDATED';
        validationExecutionResult = 'NOT_VALIDATED';
    }
    else if (isConfigIncompatible) {
        overallResult = 'FAIL';
        validationExecutionResult = 'INCOMPARABLE_CONFIGURATION';
    }
    else if (failedCount > 0) {
        overallResult = 'FAIL';
        validationExecutionResult = 'FAIL';
    }
    else if (passedCount > 0 && unvalidatedCount === 0) {
        overallResult = 'PASS';
        validationExecutionResult = 'PASS';
    }
    else if (passedCount > 0 && unvalidatedCount > 0) {
        overallResult = 'PARTIALLY_VALIDATED';
        validationExecutionResult = 'PARTIAL_PASS';
    }
    const maxAngularDiff = planetaryAngularDiffs.length > 0 ? Math.max(...planetaryAngularDiffs) : 0;
    const meanAngularDiff = planetaryAngularDiffs.length > 0
        ? planetaryAngularDiffs.reduce((a, b) => a + b, 0) / planetaryAngularDiffs.length
        : 0;
    const medianAngularDiff = calculateMedian(planetaryAngularDiffs);
    const rmsAngularDiff = calculateRMS(planetaryAngularDiffs);
    const planetLongDetails = details.filter((d) => d.category === 'PLANET_LONGITUDE' && d.status !== 'NOT_VALIDATED');
    const planetLongPassed = planetLongDetails.filter((d) => d.passed).length;
    const planetaryPassPercentage = planetLongDetails.length > 0 ? Math.round((planetLongPassed / planetLongDetails.length) * 100) : 0;
    // Granular Component Metrics Breakdown
    const ascDetail = details.find((d) => d.category === 'ASCENDANT' && d.field === 'longitude');
    const ascSignDetail = details.find((d) => d.category === 'ASCENDANT' && d.field === 'sign');
    const nakDetails = details.filter((d) => d.category === 'NAKSHATRA' && d.status !== 'NOT_VALIDATED');
    const nakNameDetails = nakDetails.filter((d) => d.field === 'nakshatra');
    const padaDetails = nakDetails.filter((d) => d.field === 'pada');
    const nakNamePassed = nakNameDetails.filter((d) => d.passed).length;
    const padaPassed = padaDetails.filter((d) => d.passed).length;
    const dashaDetails = details.filter((d) => d.category === 'DASHA' && d.status !== 'NOT_VALIDATED');
    const birthNakDetail = dashaDetails.find((d) => d.field === 'birthNakshatra');
    const startingLordDetail = dashaDetails.find((d) => d.field === 'dashaStartingLord');
    const balanceDetail = dashaDetails.find((d) => d.field === 'balanceYearsAtBirth');
    const componentBreakdown = {
        planetary: {
            comparisons: planetLongDetails.length,
            passed: planetLongPassed,
            failed: planetLongDetails.length - planetLongPassed,
            maxAngularDifference: parseFloat(maxAngularDiff.toFixed(6)),
            meanAngularDifference: parseFloat(meanAngularDiff.toFixed(6)),
            medianAngularDifference: parseFloat(medianAngularDiff.toFixed(6)),
            rmsAngularDifference: parseFloat(rmsAngularDiff.toFixed(6)),
        },
        ascendant: {
            angularDifference: ascDetail?.difference,
            signMatch: ascSignDetail?.passed || false,
            passed: (ascDetail?.passed ?? true) && (ascSignDetail?.passed ?? true),
        },
        nakshatra: {
            totalComparisons: nakDetails.length,
            nakshatraMatchCount: nakNamePassed,
            nakshatraMatchRate: nakNameDetails.length > 0 ? Math.round((nakNamePassed / nakNameDetails.length) * 100) : 0,
            padaMatchCount: padaPassed,
            padaMatchRate: padaDetails.length > 0 ? Math.round((padaPassed / padaDetails.length) * 100) : 0,
        },
        divisional: divMatrix,
        dasha: {
            birthNakshatraMatch: birthNakDetail?.passed || false,
            startingLordMatch: startingLordDetail?.passed || false,
            balanceYearsDiff: balanceDetail?.difference,
            passed: dashaDetails.length > 0 ? dashaDetails.every((d) => d.passed) : false,
        },
    };
    const accuracyMetrics = {
        maxAngularDifference: parseFloat(maxAngularDiff.toFixed(6)),
        meanAngularDifference: parseFloat(meanAngularDiff.toFixed(6)),
        medianAngularDifference: parseFloat(medianAngularDiff.toFixed(6)),
        rmsAngularDifference: parseFloat(rmsAngularDiff.toFixed(6)),
        planetaryPassPercentage,
        passedComponents: passedCount,
        totalComponents: details.length,
        componentBreakdown,
    };
    const mismatchDiagnostics = failedCount > 0 ? classifyMismatch(details, testCase) : undefined;
    return {
        benchmarkId: testCase.id,
        caseName: testCase.title || testCase.description,
        executedAt: new Date().toISOString(),
        validationStatus: overallResult === 'PASS'
            ? 'BENCHMARK_VALIDATED'
            : overallResult === 'FAIL'
                ? 'BENCHMARK_MISMATCH'
                : 'NOT_VALIDATED',
        overallResult,
        referenceCoverageStatus,
        verificationStatus,
        validationExecutionResult,
        completeness,
        accuracyMetrics,
        details,
        summary: {
            totalComponents: details.length,
            passedComponents: passedCount,
            failedComponents: failedCount,
            unvalidatedComponents: unvalidatedCount,
        },
        mismatchDiagnostics,
        actualChartOutputs: {
            ascendant: chart.lagna,
            planets: chart.planets,
            dashaBalance: dashaResult.balance,
            divisionalCharts: Object.fromEntries(Object.entries(divisionalCharts).map(([k, v]) => [k, { lagna: v.ascendant || v.lagna, planets: v.planets }])),
        },
        configurationMismatchNote,
    };
}
export async function runMultiCaseChartBenchmark(cases, tolerance = 0.05, targetSoftware) {
    const caseResults = [];
    let casesWithReferenceData = 0;
    let fullyReferencedCases = 0;
    let partiallyReferencedCases = 0;
    let unreferencedCases = 0;
    let passedCases = 0;
    let failedCases = 0;
    let incomparableCases = 0;
    let totalComparedComponents = 0;
    let totalPassedComponents = 0;
    const allObservedAngularDiffs = [];
    for (const c of cases) {
        const res = await runBirthChartBenchmark(c, tolerance, targetSoftware);
        caseResults.push(res);
        if (res.referenceCoverageStatus === 'COMPLETE') {
            fullyReferencedCases++;
            casesWithReferenceData++;
        }
        else if (res.referenceCoverageStatus === 'PARTIAL') {
            partiallyReferencedCases++;
            casesWithReferenceData++;
        }
        else {
            unreferencedCases++;
        }
        if (res.validationExecutionResult === 'PASS')
            passedCases++;
        else if (res.validationExecutionResult === 'FAIL')
            failedCases++;
        else if (res.validationExecutionResult === 'INCOMPARABLE_CONFIGURATION')
            incomparableCases++;
        for (const d of res.details) {
            if (d.status !== 'NOT_VALIDATED') {
                totalComparedComponents++;
                if (d.passed)
                    totalPassedComponents++;
                if (typeof d.difference === 'number') {
                    allObservedAngularDiffs.push(d.difference);
                }
            }
        }
    }
    const maxDiff = allObservedAngularDiffs.length > 0 ? Math.max(...allObservedAngularDiffs) : 0;
    const meanDiff = allObservedAngularDiffs.length > 0
        ? allObservedAngularDiffs.reduce((a, b) => a + b, 0) / allObservedAngularDiffs.length
        : 0;
    const medianDiff = calculateMedian(allObservedAngularDiffs);
    const rmsDiff = calculateRMS(allObservedAngularDiffs);
    const overallComponentPassRate = totalComparedComponents > 0 ? Math.round((totalPassedComponents / totalComparedComponents) * 100) : 0;
    return {
        executedAt: new Date().toISOString(),
        totalCases: cases.length,
        casesWithReferenceData,
        fullyReferencedCases,
        partiallyReferencedCases,
        unreferencedCases,
        passedCases,
        failedCases,
        incomparableCases,
        overallComponentPassRate,
        maximumObservedAngularDifference: parseFloat(maxDiff.toFixed(6)),
        meanObservedAngularDifference: parseFloat(meanDiff.toFixed(6)),
        medianObservedAngularDifference: parseFloat(medianDiff.toFixed(6)),
        rmsObservedAngularDifference: parseFloat(rmsDiff.toFixed(6)),
        caseResults,
    };
}
//# sourceMappingURL=birth-chart-runner.js.map