export function generateBirthChartValidationReport(result, benchmarkCase) {
    const lines = [];
    lines.push('====================================================');
    lines.push('       BIRTH CHART VALIDATION REPORT');
    lines.push('====================================================');
    lines.push(`Case ID:     ${result.benchmarkId}`);
    lines.push(`Title:       ${result.caseName}`);
    lines.push(`Executed At: ${result.executedAt}`);
    lines.push(`Source:      ${benchmarkCase.referenceSource?.software || 'External'} (v${benchmarkCase.referenceSource?.version || 'N/A'})`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' CALCULATION CONFIGURATION');
    lines.push('----------------------------------------------------');
    const cfg = benchmarkCase.inputSnapshot?.calculationConfig || {
        zodiacType: 'SIDEREAL',
        ayanamsha: benchmarkCase.inputSnapshot?.ayanamsha || 'Lahiri',
        houseSystem: benchmarkCase.inputSnapshot?.houseSystem || 'Whole Sign',
        nodeCalculation: 'TRUE',
        ephemerisVersion: 'Swiss Ephemeris v2.10',
    };
    lines.push(`Zodiac:           ${cfg.zodiacType}`);
    lines.push(`Ayanamsha:        ${cfg.ayanamsha}`);
    lines.push(`House System:     ${cfg.houseSystem}`);
    lines.push(`Node Calculation: ${cfg.nodeCalculation}`);
    lines.push(`Ephemeris Mode:   ${cfg.ephemerisVersion}`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' SUMMARY OF COMPARISONS');
    lines.push('----------------------------------------------------');
    lines.push(`Total Components:       ${result.summary.totalComponents}`);
    lines.push(`Passed Components:      ${result.summary.passedComponents}`);
    lines.push(`Failed Components:      ${result.summary.failedComponents}`);
    lines.push(`Unvalidated Components: ${result.summary.unvalidatedComponents}`);
    lines.push(`Overall Status:         ${result.overallResult}`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' COMPONENT DETAILS');
    lines.push('----------------------------------------------------');
    for (const d of result.details) {
        const diffStr = d.difference !== undefined ? ` (Diff: ${d.difference.toFixed(4)}°, Tol: ${d.tolerance}°)` : '';
        lines.push(`[${d.status}] ${d.category.padEnd(16)} | ${d.planetOrKey}.${d.field}: Exp='${d.expectedValue}', Act='${d.actualValue}'${diffStr}`);
    }
    lines.push('');
    if (result.mismatchDiagnostics && result.mismatchDiagnostics.hasMismatch) {
        lines.push('----------------------------------------------------');
        lines.push(' MISMATCH DIAGNOSTICS');
        lines.push('----------------------------------------------------');
        lines.push(result.mismatchDiagnostics.summary);
        for (const c of result.mismatchDiagnostics.candidates) {
            lines.push(`- Candidate: ${c.type} (Likelihood: ${c.likelihood})`);
            for (const e of c.evidence) {
                lines.push(`   * ${e}`);
            }
        }
        lines.push('');
    }
    lines.push('====================================================');
    return lines.join('\n');
}
//# sourceMappingURL=birth-chart-report.js.map