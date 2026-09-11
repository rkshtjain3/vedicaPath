export function createEvidenceItem(id, sourceEngine, sourceType, summary, classification, importance, domain, sourceId, machineEvidence) {
    return {
        id,
        sourceEngine,
        sourceType,
        sourceId: sourceId || id,
        domain: domain || 'GENERAL',
        classification,
        importance,
        summary,
        machineEvidence,
    };
}
export function normalizeRulesEvidence(rulesResult) {
    const items = [];
    if (!rulesResult)
        return items;
    if (rulesResult.evaluatedRules && Array.isArray(rulesResult.evaluatedRules)) {
        for (const r of rulesResult.evaluatedRules) {
            if (r.active) {
                items.push(createEvidenceItem(`rule_${r.id}`, 'rules-engine', 'RULE_ACTIVATION', `${r.title}: ${r.description || r.evidence?.join(', ')}`, r.category === 'CHALLENGE' ? 'CHALLENGING' : 'SUPPORTIVE', r.weight >= 1.5 ? 'HIGH' : r.weight >= 1.0 ? 'MEDIUM' : 'LOW', r.domain, r.id, r));
            }
        }
    }
    return items;
}
export function normalizeTimingEvidence(timingResult) {
    const items = [];
    if (!timingResult)
        return items;
    if (timingResult.dashaActivation?.activeRulers) {
        const lords = timingResult.dashaActivation.activeRulers.join(' - ');
        items.push(createEvidenceItem('timing_dasha_active', 'timing-engine', 'DASHA_PERIOD', `Active Vimshottari Dasha period ruled by ${lords}.`, 'FACTUAL', 'HIGH', 'TIMING', 'DASHA_CURRENT', timingResult.dashaActivation));
    }
    if (timingResult.domainTimelines && Array.isArray(timingResult.domainTimelines)) {
        for (const dt of timingResult.domainTimelines) {
            items.push(createEvidenceItem(`timing_domain_${dt.domain}`, 'timing-engine', 'DOMAIN_TIMELINE', `Timing Engine Domain ${dt.domain} status: ${dt.status} with score ${dt.score.toFixed(1)}.`, dt.status === 'SUPPORTIVE' || dt.status === 'HIGH_ACTIVITY'
                ? 'SUPPORTIVE'
                : dt.status === 'CHALLENGING'
                    ? 'CHALLENGING'
                    : 'NEUTRAL', dt.score >= 2.0 ? 'HIGH' : 'MEDIUM', dt.domain, `TIMELINE_${dt.domain}`, dt));
        }
    }
    return items;
}
export function normalizeStrengthEvidence(strengthResult, shadbalaResult) {
    const items = [];
    if (strengthResult?.planets && Array.isArray(strengthResult.planets)) {
        for (const p of strengthResult.planets) {
            items.push(createEvidenceItem(`strength_${p.planet}`, 'strength-engine', 'PLANET_STRENGTH', `${p.planet} evaluated as ${p.overallStrength} (Score: ${p.score.toFixed(1)}, Dignity: ${p.d1Dignity}).`, p.overallStrength === 'STRONG' || p.overallStrength === 'VERY_STRONG'
                ? 'SUPPORTIVE'
                : p.overallStrength === 'WEAK' || p.overallStrength === 'CHALLENGED'
                    ? 'CHALLENGING'
                    : 'NEUTRAL', p.score >= 3.0 || p.score <= 1.0 ? 'HIGH' : 'MEDIUM', 'STRENGTH', p.planet, p));
        }
    }
    if (shadbalaResult?.planetScores && Array.isArray(shadbalaResult.planetScores)) {
        for (const ps of shadbalaResult.planetScores) {
            items.push(createEvidenceItem(`shadbala_${ps.planet}`, 'shadbala-engine', 'SHADBALA_SCORE', `${ps.planet} Shadbala: ${ps.totalShadbalaRupasa.toFixed(2)} Rupas (${ps.percentageOfRequirement.toFixed(0)}% of required, Status: ${ps.isAdequate ? 'ADEQUATE' : 'INADEQUATE'}).`, ps.isAdequate ? 'SUPPORTIVE' : 'CHALLENGING', ps.percentageOfRequirement >= 120 || ps.percentageOfRequirement < 80 ? 'HIGH' : 'MEDIUM', 'STRENGTH', ps.planet, ps));
        }
    }
    return items;
}
export function normalizeYogaEvidence(yogaResult) {
    const items = [];
    if (!yogaResult?.results || !Array.isArray(yogaResult.results))
        return items;
    for (const y of yogaResult.results) {
        if (y.status === 'DETECTED') {
            items.push(createEvidenceItem(`yoga_${y.id}`, 'yoga-engine', 'YOGA_DETECTION', `${y.name} (${y.category}) detected in chart scope ${y.chartScope || 'D1'}.`, y.category === 'MAHAPURUSHA' || y.category === 'RAJA' || y.category === 'DHANA' ? 'SUPPORTIVE' : 'NEUTRAL', y.category === 'MAHAPURUSHA' || y.category === 'RAJA' ? 'HIGH' : 'MEDIUM', 'YOGAS', y.id, y));
        }
    }
    return items;
}
