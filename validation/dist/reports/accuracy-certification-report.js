import { runBirthChartBenchmark, calculateMedian, calculateRMS, } from '../benchmark-runners/birth-chart-runner.js';
export async function generateAccuracyCertification(benchmarkCases, tolerance = 0.05, targetSoftware) {
    const resultsByCase = [];
    let externallyReferencedCases = 0;
    let fullyReferencedCases = 0;
    let partiallyReferencedCases = 0;
    let unreferencedCases = 0;
    let passedCases = 0;
    let failedCases = 0;
    let incomparableCases = 0;
    let totalComparisonsPerformed = 0;
    let totalPassedComparisons = 0;
    let totalFailedComparisons = 0;
    const allAngularDiffs = [];
    for (const c of benchmarkCases) {
        const res = await runBirthChartBenchmark(c, tolerance, targetSoftware);
        resultsByCase.push(res);
        if (res.referenceCoverageStatus === 'COMPLETE') {
            fullyReferencedCases++;
            externallyReferencedCases++;
        }
        else if (res.referenceCoverageStatus === 'PARTIAL') {
            partiallyReferencedCases++;
            externallyReferencedCases++;
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
                totalComparisonsPerformed++;
                if (d.passed)
                    totalPassedComparisons++;
                else
                    totalFailedComparisons++;
                if (typeof d.difference === 'number') {
                    allAngularDiffs.push(d.difference);
                }
            }
        }
    }
    const maxDiff = allAngularDiffs.length > 0 ? Math.max(...allAngularDiffs) : 0;
    const meanDiff = allAngularDiffs.length > 0
        ? allAngularDiffs.reduce((a, b) => a + b, 0) / allAngularDiffs.length
        : 0;
    const medianDiff = calculateMedian(allAngularDiffs);
    const rmsDiff = calculateRMS(allAngularDiffs);
    const summary = {
        generatedAt: new Date().toISOString(),
        datasetVersion: 'chart-reference-dataset-v2',
        totalCases: benchmarkCases.length,
        externallyReferencedCases,
        fullyReferencedCases,
        partiallyReferencedCases,
        unreferencedCases,
        passedCases,
        failedCases,
        incomparableCases,
        totalComparisonsPerformed,
        totalPassedComparisons,
        totalFailedComparisons,
        maxAngularDifference: parseFloat(maxDiff.toFixed(6)),
        meanAngularDifference: parseFloat(meanDiff.toFixed(6)),
        medianAngularDifference: parseFloat(medianDiff.toFixed(6)),
        rmsAngularDifference: parseFloat(rmsDiff.toFixed(6)),
        resultsByCase,
    };
    const lines = [];
    lines.push('====================================================');
    lines.push('       VEDICA CALCULATION ACCURACY CERTIFICATION');
    lines.push('====================================================');
    lines.push(`Generated:                   ${summary.generatedAt}`);
    lines.push(`Dataset Version:             ${summary.datasetVersion}`);
    lines.push(`Tolerance Policy:            longitude=0.05°, boundary=0.001°`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' CERTIFICATION STATEMENT & SCOPE');
    lines.push('----------------------------------------------------');
    lines.push('Vedica calculations demonstrated agreement with the independently');
    lines.push('verified benchmark references under the specified calculation configuration.');
    lines.push('Agreement is strictly limited to tested cases, software configurations,');
    lines.push('and verified components.');
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' BENCHMARK REGISTRY & COVERAGE SUMMARY');
    lines.push('----------------------------------------------------');
    lines.push(`Total Benchmark Cases:       ${summary.totalCases}`);
    lines.push(`Externally Referenced:       ${summary.externallyReferencedCases}`);
    lines.push(`  - Fully Referenced:        ${summary.fullyReferencedCases}`);
    lines.push(`  - Partially Referenced:    ${summary.partiallyReferencedCases}`);
    lines.push(`Unreferenced (Excluded):     ${summary.unreferencedCases}`);
    lines.push(`Passed Cases:                ${summary.passedCases}`);
    lines.push(`Failed Cases:                ${summary.failedCases}`);
    lines.push(`Incomparable Config Cases:   ${summary.incomparableCases}`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' COMPUTATIONAL ACCURACY METRICS');
    lines.push('----------------------------------------------------');
    lines.push(`Total Component Comparisons: ${summary.totalComparisonsPerformed}`);
    lines.push(`Passed Comparisons:          ${summary.totalPassedComparisons}`);
    lines.push(`Failed Comparisons:          ${summary.totalFailedComparisons}`);
    lines.push(`Maximum Angular Difference:  ${summary.maxAngularDifference.toFixed(6)}°`);
    lines.push(`Mean Angular Difference:     ${summary.meanAngularDifference.toFixed(6)}°`);
    lines.push(`Median Angular Difference:   ${summary.medianAngularDifference.toFixed(6)}°`);
    lines.push(`RMS Angular Difference:      ${summary.rmsAngularDifference.toFixed(6)}°`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' CASE RESULTS BREAKDOWN');
    lines.push('----------------------------------------------------');
    for (const r of resultsByCase) {
        const vStr = r.verificationStatus ? ` [Verification: ${r.verificationStatus}]` : '';
        lines.push(`[${r.validationExecutionResult.padEnd(26)}] ${r.benchmarkId}: ${r.caseName} (Completeness: ${r.completeness.overallPercent}%${vStr})`);
    }
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' CERTIFICATION SCOPE & LIMITATIONS');
    lines.push('----------------------------------------------------');
    lines.push('1. Scope: Certifies computational agreement of Vedica Swiss Ephemeris calculation');
    lines.push('   engines against third-party reference outputs under verified astronomical settings.');
    lines.push('2. Exclusions: Unvalidated / unreferenced cases (NOT_AVAILABLE) are explicitly excluded');
    lines.push('   from calculation accuracy statistics and pass rates.');
    lines.push('3. Non-Predictive Disclaimer: Benchmark agreement establishes astronomical calculation');
    lines.push('   fidelity ONLY. It does NOT constitute scientific proof or empirical validation');
    lines.push('   of astrological predictions.');
    lines.push('====================================================');
    return { summary, textReport: lines.join('\n') };
}
//# sourceMappingURL=accuracy-certification-report.js.map