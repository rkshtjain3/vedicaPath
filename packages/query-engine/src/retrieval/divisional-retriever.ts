import { QueryEvidenceItem } from '../types.js';

export function retrieveDivisionalEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const div = calculationData.divisionalCharts || {};

  // D9 Navamsha Analysis
  if (div.d9Analysis) {
    const d9 = div.d9Analysis;
    if (!targetPlanet || d9.ascendantLord?.toLowerCase() === targetPlanet.toLowerCase()) {
      items.push({
        id: 'D9-NAVAMSHA-ASCENDANT',
        sourceEngine: 'DIVISIONAL_CHART',
        sourceRuleId: 'D9-ANALYSIS',
        category: 'D9 Navamsha',
        direction: 'FACTUAL',
        title: `D9 Navamsha Lagna: ${d9.ascendantSign}`,
        description: `D9 Navamsha Ascendant is in ${d9.ascendantSign} ruled by ${d9.ascendantLord}, governing inner potential and relationships.`,
        whyEvidence: [
          `D9 Ascendant Sign: ${d9.ascendantSign}`,
          `D9 Ascendant Lord: ${d9.ascendantLord}`,
        ],
      });
    }
  }

  // D10 Dashamsha Analysis
  if (div.d10Analysis) {
    const d10 = div.d10Analysis;
    if (!targetPlanet || d10.ascendantLord?.toLowerCase() === targetPlanet.toLowerCase()) {
      items.push({
        id: 'D10-DASHAMSHA-ASCENDANT',
        sourceEngine: 'DIVISIONAL_CHART',
        sourceRuleId: 'D10-ANALYSIS',
        category: 'D10 Dashamsha',
        domain: 'CAREER',
        direction: 'FACTUAL',
        title: `D10 Dashamsha Lagna: ${d10.ascendantSign}`,
        description: `D10 Dashamsha Ascendant is in ${d10.ascendantSign} ruled by ${d10.ascendantLord}, governing career and professional activities.`,
        whyEvidence: [
          `D10 Ascendant Sign: ${d10.ascendantSign}`,
          `D10 Ascendant Lord: ${d10.ascendantLord}`,
        ],
      });
    }
  }

  return items;
}
