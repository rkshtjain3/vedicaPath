export function calculateConfidence(params) {
    const { factors, mixedSignals, hasTimingData } = params;
    const rationale = [];
    let score = 0;
    // Factor count evaluation
    if (factors.length >= 4) {
        score += 40;
        rationale.push(`Strong volume of evidence (${factors.length} active factors detected)`);
    }
    else if (factors.length >= 2) {
        score += 25;
        rationale.push(`Moderate volume of evidence (${factors.length} active factors detected)`);
    }
    else if (factors.length === 1) {
        score += 10;
        rationale.push(`Limited evidence (1 active factor detected)`);
    }
    else {
        rationale.push(`No active factors detected for this domain`);
    }
    // Timing agreement
    const hasDasha = factors.some((f) => f.type === 'DASHA');
    const hasTransit = factors.some((f) => f.type === 'TRANSIT');
    const hasRule = factors.some((f) => f.type === 'RULE');
    if (hasRule && (hasDasha || hasTransit)) {
        score += 35;
        rationale.push('High convergence between natal chart rules and active timing/transits');
    }
    else if (hasRule) {
        score += 20;
        rationale.push('Supported by natal chart rule indications');
    }
    else if (hasDasha || hasTransit) {
        score += 20;
        rationale.push('Supported by current period timing & planetary transits');
    }
    // Timing data completeness
    if (hasTimingData) {
        score += 15;
        rationale.push('Complete Dasha and planetary transit calculations available');
    }
    else {
        rationale.push('Partial timing data available');
    }
    // Mixed signal conflict adjustment
    if (mixedSignals.mixedSignals) {
        score -= 10;
        rationale.push(`Preserved mixed signals: ${mixedSignals.supportiveCount} supportive vs ${mixedSignals.challengingCount} challenging factors`);
    }
    let level = 'LOW';
    if (score >= 60) {
        level = 'HIGH';
    }
    else if (score >= 35) {
        level = 'MEDIUM';
    }
    const disclaimer = 'Confidence level represents consistency and volume of structured evidence within the configured astrological framework. It does NOT represent scientific probability or guaranteed real-world outcomes.';
    return {
        level,
        score: Math.max(0, Math.min(100, score)),
        rationale,
        disclaimer,
    };
}
//# sourceMappingURL=confidence-calculator.js.map