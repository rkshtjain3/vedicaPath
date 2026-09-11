import { QueryEvidenceItem } from '../types.js';

export function retrieveNatalEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const ast = calculationData.astrology || calculationData.chart || {};
  const analysis = calculationData.analysis || {};

  // Lagna Evidence
  if (ast.ascendant && (!targetPlanet || targetPlanet === ast.ascendant?.sign?.ruler)) {
    items.push({
      id: 'NATAL-LAGNA-001',
      sourceEngine: 'ASTROLOGY_CORE',
      sourceRuleId: 'LAGNA-POSITION',
      category: 'Natal Lagna',
      direction: 'FACTUAL',
      title: `Ascendant in ${ast.ascendant.sign?.name}`,
      description: `Lagna is situated in ${ast.ascendant.sign?.name} (${ast.ascendant.sign?.sanskritName}) ruled by ${ast.ascendant.sign?.ruler}.`,
      whyEvidence: [
        `Ascendant Longitude: ${ast.ascendant.longitude?.toFixed(2)}°`,
        `Rasi: ${ast.ascendant.sign?.name}`,
        `Sign Ruler: ${ast.ascendant.sign?.ruler}`,
      ],
    });
  }

  // Planetary Placements
  if (ast.planets && Array.isArray(ast.planets)) {
    for (const p of ast.planets) {
      if (targetPlanet && p.planet?.toLowerCase() !== targetPlanet.toLowerCase()) continue;

      const isStrong = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'].includes(p.dignity);
      const isWeak = ['DEBILITATED', 'ENEMY_SIGN'].includes(p.dignity);
      const direction = isStrong ? 'SUPPORTIVE' : isWeak ? 'CHALLENGING' : 'NEUTRAL';

      items.push({
        id: `NATAL-PLANET-${p.planet.toUpperCase()}`,
        sourceEngine: 'ASTROLOGY_CORE',
        sourceRuleId: 'PLANET-PLACEMENT',
        category: 'Planetary Placement',
        planet: p.planet,
        direction,
        title: `${p.planet} in ${p.sign?.name} (${p.house || 1}th House)`,
        description: `${p.planet} is placed in House ${p.house || 1} (${p.sign?.name}) with ${p.dignity || 'NEUTRAL'} dignity. Nakshatra: ${p.nakshatra?.name || 'N/A'}.`,
        whyEvidence: [
          `Planet: ${p.planet}`,
          `Sign: ${p.sign?.name}`,
          `House from Lagna: ${p.house || 1}`,
          `Dignity: ${p.dignity || 'NEUTRAL'}`,
          `Nakshatra: ${p.nakshatra?.name || 'N/A'} (Pada ${p.nakshatra?.pada || 1})`,
        ],
      });
    }
  }

  // House Lords Facts
  if (analysis.houseLordFacts && Array.isArray(analysis.houseLordFacts)) {
    for (const hl of analysis.houseLordFacts) {
      if (targetPlanet && hl.lord?.toLowerCase() !== targetPlanet.toLowerCase()) continue;

      items.push({
        id: `NATAL-HOUSE-LORD-${hl.house}`,
        sourceEngine: 'ASTROLOGY_CORE',
        sourceRuleId: 'HOUSE-LORDSHIP',
        category: 'House Lordship',
        planet: hl.lord,
        direction: ['EXALTED', 'OWN_SIGN'].includes(hl.dignity) ? 'SUPPORTIVE' : 'NEUTRAL',
        title: `House ${hl.house} Lord (${hl.lord})`,
        description: `Lord of House ${hl.house} (${hl.lord}) is placed in House ${hl.lordHouse} in ${hl.dignity} dignity.`,
        whyEvidence: [
          `House: ${hl.house}`,
          `Lord: ${hl.lord}`,
          `Placed in House: ${hl.lordHouse}`,
          `Dignity: ${hl.dignity}`,
        ],
      });
    }
  }

  return items;
}
