import { PERSONAL_QUERY_V1 } from '../profile.js';
export function rankEvidenceItems(items, intent, profile = PERSONAL_QUERY_V1) {
    const scored = items.map((item) => {
        let score = item.weight ? item.weight * 10 : 10;
        // Direct planet match
        if (intent.planet && item.planet?.toLowerCase() === intent.planet.toLowerCase()) {
            score += profile.rankingPolicy.directMatchBonus;
        }
        // Direct domain match
        if (intent.domain && item.domain === intent.domain) {
            score += profile.rankingPolicy.domainRelevanceBonus;
        }
        // Active timing match
        if (intent.category === 'TIMING' || intent.category === 'TRANSIT') {
            if (item.sourceEngine === 'TRANSIT' || item.sourceEngine === 'DASHA' || item.sourceEngine === 'TIMELINE') {
                score += profile.rankingPolicy.activeTimingBonus;
            }
        }
        return { item, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const deduplicated = [];
    const seenIds = new Set();
    for (const entry of scored) {
        if (!seenIds.has(entry.item.id)) {
            seenIds.add(entry.item.id);
            deduplicated.push(entry.item);
        }
    }
    return deduplicated.slice(0, profile.maxEvidenceItemsPerAnswer);
}
