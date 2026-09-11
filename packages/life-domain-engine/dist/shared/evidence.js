export function createEvidenceItem(params) {
    const defaultWeight = params.strength === 'HIGH' ? 1.0 : params.strength === 'MEDIUM' ? 0.7 : 0.4;
    return {
        id: params.id,
        domain: params.domain,
        sourceEngine: params.sourceEngine,
        sourceRuleId: params.sourceRuleId,
        description: params.description,
        direction: params.direction,
        strength: params.strength,
        weight: params.weight ?? defaultWeight,
        whyEvidence: params.whyEvidence,
    };
}
//# sourceMappingURL=evidence.js.map