import { QueryEvidenceItem } from '../types.js';

export function retrieveYogaEvidence(calculationData: any, targetPlanet?: string): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const yogaAnalysis = calculationData.yogaAnalysis || {};

  if (yogaAnalysis.detectedYogas && Array.isArray(yogaAnalysis.detectedYogas)) {
    for (const y of yogaAnalysis.detectedYogas) {
      if (
        targetPlanet &&
        !y.involvedPlanets?.some((p: string) => p.toLowerCase() === targetPlanet.toLowerCase())
      ) {
        continue;
      }

      items.push({
        id: `YOGA-${y.id || y.name.replace(/\s+/g, '-').toUpperCase()}`,
        sourceEngine: 'YOGA',
        sourceRuleId: y.id || 'CLASSICAL-YOGA',
        category: 'Classical Yoga',
        planet: y.involvedPlanets?.[0] as any,
        direction: y.category === 'RAJA' || y.category === 'DHANA' ? 'SUPPORTIVE' : 'SUPPORTIVE',
        title: `Detected Yoga: ${y.name}`,
        description: `${y.name} (${y.category || 'Special'} Yoga) is detected in chart. ${y.description || ''}`,
        whyEvidence: [
          `Yoga Name: ${y.name}`,
          `Category: ${y.category || 'CLASSICAL'}`,
          `Involved Planets: ${y.involvedPlanets?.join(', ') || 'N/A'}`,
          `Conditions Met: ${y.conditionsMet?.join('; ') || 'Standard conditions satisfied'}`,
        ],
      });
    }
  }

  return items;
}
