import { EvidenceGroup, QueryEvidenceItem, SourceEngineId } from '../types.js';

const ENGINE_TITLES: Record<SourceEngineId, string> = {
  ASTROLOGY_CORE: 'Natal Chart Context',
  DIVISIONAL_CHART: 'Divisional Chart Context (D9 / D10)',
  DASHA: 'Vimshottari Dasha Context',
  TIMELINE: 'Multi-Level Timeline Context',
  TRANSIT: 'Current Transit (Gochar) Context',
  ASHTAKAVARGA: 'Ashtakavarga Context (BAV / SAV)',
  STRENGTH: 'Planetary Strength Context',
  SHADBALA: 'Classical Shadbala Components',
  YOGA: 'Classical Yoga Context',
  LIFE_DOMAIN: 'Life Domain Synthesis',
  NUMEROLOGY: 'Numerology & Name Context',
  RULES_ENGINE: 'Classical Rules Context',
};

export function groupEvidenceItems(items: QueryEvidenceItem[]): EvidenceGroup[] {
  const map = new Map<SourceEngineId, QueryEvidenceItem[]>();

  for (const item of items) {
    const list = map.get(item.sourceEngine) || [];
    list.push(item);
    map.set(item.sourceEngine, list);
  }

  const groups: EvidenceGroup[] = [];
  for (const [engineId, evidence] of map.entries()) {
    groups.push({
      title: ENGINE_TITLES[engineId] || engineId,
      engineId,
      evidence,
    });
  }

  return groups;
}
