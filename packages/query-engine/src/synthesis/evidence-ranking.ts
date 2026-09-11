import { QueryEvidenceItem, QueryIntent } from '../types.js';
import { PERSONAL_QUERY_V1, QueryProfile } from '../profile.js';

export function rankEvidenceItems(
  items: QueryEvidenceItem[],
  intent: QueryIntent,
  profile: QueryProfile = PERSONAL_QUERY_V1
): QueryEvidenceItem[] {
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

  const deduplicated: QueryEvidenceItem[] = [];
  const seenIds = new Set<string>();

  for (const entry of scored) {
    if (!seenIds.has(entry.item.id)) {
      seenIds.add(entry.item.id);
      deduplicated.push(entry.item);
    }
  }

  return deduplicated.slice(0, profile.maxEvidenceItemsPerAnswer);
}
