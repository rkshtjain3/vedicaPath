import { QueryEvidenceItem } from '../types.js';

export function retrieveStrengthEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const strength = calculationData.strengthAnalysis || {};

  if (strength.planets && Array.isArray(strength.planets)) {
    for (const p of strength.planets) {
      if (targetPlanet && p.planet?.toLowerCase() !== targetPlanet.toLowerCase()) continue;

      const isStrong = p.score >= 70 || p.dignity === 'EXALTED' || p.dignity === 'OWN_SIGN';
      const isWeak = p.score <= 40 || p.dignity === 'DEBILITATED';
      const direction = isStrong ? 'SUPPORTIVE' : isWeak ? 'CHALLENGING' : 'NEUTRAL';

      items.push({
        id: `STRENGTH-${p.planet.toUpperCase()}`,
        sourceEngine: 'STRENGTH',
        sourceRuleId: 'PLANETARY-STRENGTH',
        category: 'Planetary Strength',
        planet: p.planet,
        direction,
        title: `${p.planet} Strength Score: ${p.score?.toFixed(1) || 50}/100`,
        description: `${p.planet} possesses ${p.dignity || 'NEUTRAL'} dignity with a relative strength score of ${p.score?.toFixed(1) || 50}/100.`,
        whyEvidence: [
          `Planet: ${p.planet}`,
          `Strength Score: ${p.score?.toFixed(1) || 50}`,
          `Dignity: ${p.dignity || 'NEUTRAL'}`,
          `Combust: ${p.isCombust ? 'YES' : 'NO'}`,
          `Retrograde: ${p.isRetrograde ? 'YES' : 'NO'}`,
          `Vargottama: ${p.isVargottama ? 'YES' : 'NO'}`,
        ],
      });
    }
  }

  return items;
}
