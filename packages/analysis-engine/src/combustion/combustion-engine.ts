import { CombustionResult, PlanetFact } from '../types/analysis-types.js';
import { calculateAngularDistance } from '../conjunctions/conjunction-engine.js';

export function calculateCombustion(
  planetFacts: PlanetFact[],
  combustionThresholds: Record<string, { direct: number; retrograde: number }>
): CombustionResult[] {
  const sun = planetFacts.find((p) => p.planet === 'Sun');
  if (!sun) return [];

  const results: CombustionResult[] = [];

  for (const p of planetFacts) {
    if (p.planet === 'Sun' || p.planet === 'Rahu' || p.planet === 'Ketu') {
      continue;
    }

    const dist = calculateAngularDistance(p.longitude, sun.longitude);
    const thresholdConfig = combustionThresholds[p.planet] || { direct: 12, retrograde: 12 };
    const threshold = p.retrograde ? thresholdConfig.retrograde : thresholdConfig.direct;

    results.push({
      planet: p.planet,
      distanceFromSun: Number(dist.toFixed(4)),
      combustionThreshold: threshold,
      isCombust: dist <= threshold,
    });
  }

  return results;
}
