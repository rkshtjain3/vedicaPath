export function evaluateCombustionFactor(planet, analysis, profile) {
    if (planet === 'Sun')
        return null;
    const combustion = analysis.combustion.find((c) => c.planet === planet);
    if (!combustion)
        return null;
    const weight = profile?.weights.COMBUSTION ?? -3;
    const isCombust = combustion.isCombust;
    const effect = isCombust ? 'CHALLENGING' : 'NEUTRAL';
    const scoreContribution = isCombust ? weight : 0;
    const evidence = isCombust
        ? [
            `${planet} is combust.`,
            `Angular distance from Sun: ${combustion.distanceFromSun.toFixed(2)}°.`,
            `Threshold: ${combustion.combustionThreshold}°.`,
            `Strength effect: CHALLENGING.`,
        ]
        : [
            `${planet} is not combust.`,
            `Angular distance from Sun: ${combustion.distanceFromSun.toFixed(2)}°.`,
            `Threshold: ${combustion.combustionThreshold}°.`,
        ];
    return {
        id: `COMBUSTION_${planet.toUpperCase()}`,
        category: 'COMBUSTION',
        effect,
        scoreContribution,
        evidence,
    };
}
export function evaluateRetrogradeFactor(planet, analysis, profile) {
    const pFact = analysis.planetFacts.find((p) => p.planet === planet);
    const isRetro = pFact ? pFact.retrograde : false;
    const defaultWeight = profile?.weights.RETROGRADE_DEFAULT ?? 0;
    const evidence = isRetro
        ? [
            `${planet} is in retrograde motion.`,
            `Classification: FACTUAL_MODIFIER.`,
            `Default score contribution: ${defaultWeight}.`,
        ]
        : [
            `${planet} is in direct motion.`,
            `Classification: FACTUAL_MODIFIER.`,
        ];
    return {
        id: `RETROGRADE_${planet.toUpperCase()}`,
        category: 'RETROGRADE',
        effect: 'NEUTRAL',
        scoreContribution: defaultWeight,
        evidence,
    };
}
