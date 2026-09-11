import { QueryEvidenceItem } from '../types.js';

export function retrieveShadbalaEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const shadbala = calculationData.shadbala || {};

  if (shadbala.planets && Array.isArray(shadbala.planets)) {
    for (const p of shadbala.planets) {
      if (targetPlanet && p.planet?.toLowerCase() !== targetPlanet.toLowerCase()) continue;

      const direction = p.isStrong ? 'SUPPORTIVE' : 'NEUTRAL';
      const ratioStr = p.ratio ? p.ratio.toFixed(2) : '1.00';
      const rupasStr = p.totalRupa ? p.totalRupa.toFixed(2) : '0.00';

      items.push({
        id: `SHADBALA-${p.planet.toUpperCase()}`,
        sourceEngine: 'SHADBALA',
        sourceRuleId: 'SHADBALA-COMPONENTS',
        category: 'Classical Shadbala',
        planet: p.planet,
        direction,
        title: `${p.planet} Shadbala: ${rupasStr} Rupas (Ratio: ${ratioStr})`,
        description: `${p.planet} achieves ${rupasStr} Rupas (${p.isStrong ? 'Exceeds required threshold' : 'Below required threshold'}) with ratio ${ratioStr}.`,
        whyEvidence: [
          `Planet: ${p.planet}`,
          `Total Rupas: ${rupasStr}`,
          `Required Rupas: ${p.requiredRupa ? p.requiredRupa.toFixed(2) : 'N/A'}`,
          `Ratio: ${ratioStr}`,
          `Sthana Bala: ${p.components?.sthanaBala?.total?.toFixed(2) || 'N/A'}`,
          `Dik Bala: ${p.components?.dikBala?.total?.toFixed(2) || 'N/A'}`,
          `Kala Bala: ${p.components?.kalaBala?.total?.toFixed(2) || 'N/A'}`,
          `Chesta Bala: ${p.components?.chestaBala?.total?.toFixed(2) || 'N/A'}`,
          `Naisargika Bala: ${p.components?.naisargikaBala?.total?.toFixed(2) || 'N/A'}`,
          `Drik Bala: ${p.components?.drikBala?.total?.toFixed(2) || 'N/A'}`,
        ],
      });
    }
  }

  return items;
}
