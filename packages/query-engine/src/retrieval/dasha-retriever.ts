import { QueryEvidenceItem } from '../types.js';

export function retrieveDashaEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const dasha = calculationData.dasha || {};
  const current = dasha.current || dasha.active || {};

  if (current.mahadasha) {
    const md = current.mahadasha;
    if (!targetPlanet || md.lord?.toLowerCase() === targetPlanet.toLowerCase()) {
      items.push({
        id: `DASHA-MAHADASHA-${md.lord}`,
        sourceEngine: 'DASHA',
        sourceRuleId: 'ACTIVE-MAHADASHA',
        category: 'Vimshottari Dasha',
        planet: md.lord,
        direction: 'NEUTRAL',
        title: `Active Mahadasha: ${md.lord}`,
        description: `Current Vimshottari Mahadasha is ruled by ${md.lord}. Period: ${md.startDate ? new Date(md.startDate).toLocaleDateString() : 'N/A'} - ${md.endDate ? new Date(md.endDate).toLocaleDateString() : 'N/A'}.`,
        whyEvidence: [
          `Mahadasha Lord: ${md.lord}`,
          `Start Date: ${md.startDate || 'N/A'}`,
          `End Date: ${md.endDate || 'N/A'}`,
        ],
      });
    }
  }

  if (current.antardasha) {
    const ad = current.antardasha;
    if (!targetPlanet || ad.lord?.toLowerCase() === targetPlanet.toLowerCase()) {
      items.push({
        id: `DASHA-ANTARDASHA-${ad.lord}`,
        sourceEngine: 'DASHA',
        sourceRuleId: 'ACTIVE-ANTARDASHA',
        category: 'Vimshottari Dasha',
        planet: ad.lord,
        direction: 'NEUTRAL',
        title: `Active Antardasha: ${ad.lord}`,
        description: `Current Antardasha is ruled by ${ad.lord} within ${current.mahadasha?.lord || 'N/A'} Mahadasha.`,
        whyEvidence: [
          `Antardasha Lord: ${ad.lord}`,
          `Parent Mahadasha: ${current.mahadasha?.lord || 'N/A'}`,
        ],
      });
    }
  }

  if (current.pratyantardasha) {
    const pad = current.pratyantardasha;
    if (!targetPlanet || pad.lord?.toLowerCase() === targetPlanet.toLowerCase()) {
      items.push({
        id: `DASHA-PRATYANTARDASHA-${pad.lord}`,
        sourceEngine: 'DASHA',
        sourceRuleId: 'ACTIVE-PRATYANTARDASHA',
        category: 'Vimshottari Dasha',
        planet: pad.lord,
        direction: 'NEUTRAL',
        title: `Active Pratyantardasha: ${pad.lord}`,
        description: `Current Pratyantardasha is ruled by ${pad.lord}.`,
        whyEvidence: [`Pratyantardasha Lord: ${pad.lord}`],
      });
    }
  }

  return items;
}
