export function createTransitEvidence(id, planet, domain, direction, weight, sourceRuleId, description, whyEvidence) {
    return {
        id,
        planet,
        domain,
        direction,
        weight,
        sourceRuleId,
        description,
        whyEvidence,
    };
}
