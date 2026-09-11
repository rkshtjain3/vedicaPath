const CHALLENGING_DIMENSIONS = [
    'OBSTACLES',
    'CHALLENGES',
    'VOLATILITIES',
    'EXPENSEPRESSURE',
    'EXPENSES',
    'DELAYS',
    'AFFLICTION',
];
const SUPPORTIVE_DIMENSIONS = [
    'GROWTH',
    'INCOMEPOTENTIAL',
    'ASSETBUILDING',
    'RELATIONSHIPACTIVITY',
    'HARMONY',
    'PROPERTYACTIVITY',
    'ACQUISITIONPOTENTIAL',
    'RESPONSIBILITY',
    'DIGNITY',
];
export function classifyRuleEvaluation(evalItem) {
    let classification = 'NEUTRAL';
    let hasSupportive = false;
    let hasChallenging = false;
    for (const eff of evalItem.effects) {
        const dimUpper = eff.dimension.toUpperCase();
        if (CHALLENGING_DIMENSIONS.includes(dimUpper)) {
            if (eff.value > 0)
                hasChallenging = true;
        }
        else if (SUPPORTIVE_DIMENSIONS.includes(dimUpper)) {
            if (eff.value > 0)
                hasSupportive = true;
            else if (eff.value < 0)
                hasChallenging = true;
        }
    }
    if (hasSupportive && !hasChallenging) {
        classification = 'SUPPORTIVE';
    }
    else if (hasChallenging && !hasSupportive) {
        classification = 'CHALLENGING';
    }
    else if (hasSupportive && hasChallenging) {
        classification = 'CHALLENGING';
    }
    const primaryEvidence = evalItem.evidence[0];
    const title = primaryEvidence?.details || `Rule ${evalItem.ruleId} active`;
    const description = evalItem.effects
        .map((e) => `${e.dimension}: ${e.value > 0 ? '+' : ''}${e.value}`)
        .join(', ');
    return {
        id: `factor_rule_${evalItem.ruleId}`,
        type: 'RULE',
        sourceId: evalItem.ruleId,
        title,
        description: description || 'Astrological rule indication',
        classification,
        evidence: evalItem.evidence,
    };
}
export function classifyDashaActivations(dashaActivation, domain) {
    const factors = [];
    const levels = [
        { name: 'Mahadasha', act: dashaActivation.mahadasha, weight: 3 },
        { name: 'Antardasha', act: dashaActivation.antardasha, weight: 2 },
        { name: 'Pratyantardasha', act: dashaActivation.pratyantardasha, weight: 1 },
    ];
    for (const lvl of levels) {
        if (lvl.act && lvl.act.connected) {
            factors.push({
                id: `factor_dasha_${lvl.name.toLowerCase()}_${lvl.act.lord}`,
                type: 'DASHA',
                sourceId: `DASHA-${lvl.name.toUpperCase()}-${lvl.act.lord}`,
                title: `${lvl.name} Lord (${lvl.act.lord}) connected to ${domain} domain`,
                description: `Active ${lvl.name.toLowerCase()} period lord is connected to domain houses (${lvl.weight} pts)`,
                classification: 'SUPPORTIVE',
                weight: lvl.weight,
                evidence: lvl.act.evidence || [],
            });
        }
    }
    return factors;
}
export function classifyTransitEvaluations(transits) {
    const factors = [];
    for (const tr of transits) {
        if (!tr.triggered)
            continue;
        let classification = 'SUPPORTIVE';
        let hasChallenging = false;
        for (const eff of tr.effects) {
            const dimUpper = eff.dimension.toUpperCase();
            if (CHALLENGING_DIMENSIONS.includes(dimUpper)) {
                hasChallenging = true;
            }
        }
        if (hasChallenging) {
            classification = 'CHALLENGING';
        }
        factors.push({
            id: `factor_transit_${tr.ruleId}`,
            type: 'TRANSIT',
            sourceId: tr.ruleId,
            title: tr.evidence?.details || `Transit trigger [${tr.ruleId}]`,
            description: tr.effects.map((e) => `${e.dimension}: +${e.value}`).join(', '),
            classification,
            evidence: [tr.evidence],
        });
    }
    return factors;
}
//# sourceMappingURL=factor-classifier.js.map