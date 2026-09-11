import { BirthChart } from '@vedica/astrology-core';
import { AnalysisProfile, PERSONAL_ANALYSIS_V1 } from './config/analysis-profile.js';
import { ChartAnalysisResult } from './types/analysis-types.js';
import { calculatePlanetFacts } from './chart-facts/planet-facts.js';
import { calculateHouseFacts } from './houses/house-facts.js';
import { calculateAllDignities } from './dignities/dignity-engine.js';
import { calculateHouseLordFacts } from './lords/house-lord-facts.js';
import { detectConjunctions } from './conjunctions/conjunction-engine.js';
import { calculateVedicAspects } from './aspects/aspect-engine.js';
import { calculateCombustion } from './combustion/combustion-engine.js';
import { detectAllYogas } from './yogas/yoga-engine.js';

export function analyzeChart(
  chart: BirthChart,
  profile: AnalysisProfile = PERSONAL_ANALYSIS_V1
): ChartAnalysisResult {
  const planetFacts = calculatePlanetFacts(chart);
  const houseFacts = calculateHouseFacts(chart.lagna.sign.id - 1, planetFacts);
  const dignities = calculateAllDignities(planetFacts);
  const houseLordFacts = calculateHouseLordFacts(houseFacts, planetFacts, dignities);
  const conjunctions = detectConjunctions(planetFacts, profile.conjunctionOrbDegrees);
  const aspects = calculateVedicAspects(planetFacts, profile.includeNodeAspects);
  const combustion = calculateCombustion(planetFacts, profile.combustionThresholds);
  const yogas = detectAllYogas(
    planetFacts,
    houseFacts,
    houseLordFacts,
    conjunctions,
    aspects,
    dignities
  );

  return {
    calculationProfileVersion: chart.calculationProfile?.version || 'personal-vedic-v1',
    analysisProfileVersion: profile.version,
    planetFacts,
    houseFacts,
    houseLordFacts,
    conjunctions,
    aspects,
    dignities,
    combustion,
    yogas,
  };
}
