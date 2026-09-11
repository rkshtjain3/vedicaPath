import { evaluateMultiLevelDashaActivation } from '../dasha/dasha-activation.js';
function getDashaRating(score, profile) {
    if (score >= profile.scoringBoundaries.dashaActivation.HIGH_MIN)
        return 'HIGH';
    if (score >= profile.scoringBoundaries.dashaActivation.MODERATE_MIN)
        return 'MODERATE';
    return 'LOW';
}
export function getDomainDashaTimeline(params) {
    const { analysis, mahadashas, domain, start, end, profile } = params;
    const periods = [];
    for (const md of mahadashas) {
        if (md.end < start || md.start > end)
            continue;
        for (const ad of md.children || []) {
            if (ad.end < start || ad.start > end)
                continue;
            if (ad.children && ad.children.length > 0) {
                for (const pd of ad.children) {
                    if (pd.end < start || pd.start > end)
                        continue;
                    const pStart = pd.start < start ? start : pd.start;
                    const pEnd = pd.end > end ? end : pd.end;
                    const dashaActivation = evaluateMultiLevelDashaActivation({
                        mahadasha: { lord: md.lord },
                        antardasha: { lord: ad.lord },
                        pratyantardasha: { lord: pd.lord },
                    }, domain, analysis, profile);
                    const activity = getDashaRating(dashaActivation.totalScore, profile);
                    const factors = [];
                    if (dashaActivation.mahadasha.connected) {
                        factors.push(`Mahadasha lord (${md.lord}) connected to ${domain}`);
                    }
                    if (dashaActivation.antardasha.connected) {
                        factors.push(`Antardasha lord (${ad.lord}) connected to ${domain}`);
                    }
                    if (dashaActivation.pratyantardasha.connected) {
                        factors.push(`Pratyantardasha lord (${pd.lord}) connected to ${domain}`);
                    }
                    periods.push({
                        start: pStart.toISOString(),
                        end: pEnd.toISOString(),
                        activity,
                        dashaActivation,
                        transitEvaluations: [],
                        factors,
                    });
                }
            }
            else {
                const pStart = ad.start < start ? start : ad.start;
                const pEnd = ad.end > end ? end : ad.end;
                const dashaActivation = evaluateMultiLevelDashaActivation({
                    mahadasha: { lord: md.lord },
                    antardasha: { lord: ad.lord },
                }, domain, analysis, profile);
                const activity = getDashaRating(dashaActivation.totalScore, profile);
                const factors = [];
                if (dashaActivation.mahadasha.connected) {
                    factors.push(`Mahadasha lord (${md.lord}) connected to ${domain}`);
                }
                if (dashaActivation.antardasha.connected) {
                    factors.push(`Antardasha lord (${ad.lord}) connected to ${domain}`);
                }
                periods.push({
                    start: pStart.toISOString(),
                    end: pEnd.toISOString(),
                    activity,
                    dashaActivation,
                    transitEvaluations: [],
                    factors,
                });
            }
        }
    }
    // Merge adjacent periods if activity & totalScore are identical
    const merged = [];
    for (const p of periods) {
        if (merged.length === 0) {
            merged.push({ ...p });
            continue;
        }
        const prev = merged[merged.length - 1];
        if (prev.activity === p.activity &&
            prev.dashaActivation.totalScore === p.dashaActivation.totalScore) {
            prev.end = p.end;
        }
        else {
            merged.push({ ...p });
        }
    }
    return merged;
}
//# sourceMappingURL=dasha-timeline.js.map