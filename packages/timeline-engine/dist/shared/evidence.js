export function createTimingEvidence(params) {
    const strengthMultipliers = {
        HIGH: 1.5,
        MEDIUM: 1.0,
        LOW: 0.5,
    };
    const weight = strengthMultipliers[params.strength] || 1.0;
    const defaultWhy = [
        `Engine: ${params.sourceEngine}`,
        `Planet: ${params.planet}`,
        `Direction: ${params.direction}`,
        `Strength: ${params.strength}`,
        `Description: ${params.description}`,
    ];
    return {
        id: params.id,
        periodId: params.periodId,
        domain: params.domain,
        planet: params.planet,
        sourceEngine: params.sourceEngine,
        sourceRuleId: params.sourceRuleId,
        description: params.description,
        direction: params.direction,
        strength: params.strength,
        weight,
        whyEvidence: params.whyEvidence || defaultWhy,
    };
}
//# sourceMappingURL=evidence.js.map