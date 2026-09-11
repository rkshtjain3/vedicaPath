export function classifyTimingWindowContext(scoring) {
    const { supportScore, challengeScore, totalEvidence } = scoring;
    if (totalEvidence === 0) {
        return 'INSUFFICIENT_EVIDENCE';
    }
    if (supportScore >= 1.2 && challengeScore >= 1.2) {
        return 'MIXED_EVIDENCE_CONTEXT';
    }
    if (supportScore >= 3.0 && challengeScore < 1.0) {
        return 'HIGH_EVIDENCE_CONTEXT';
    }
    if (supportScore >= 1.5 || challengeScore >= 1.5) {
        return 'MODERATE_EVIDENCE_CONTEXT';
    }
    return 'LOW_EVIDENCE_CONTEXT';
}
//# sourceMappingURL=window-classifier.js.map