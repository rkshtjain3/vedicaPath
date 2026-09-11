import { AshtakavargaResult, AshtakavargaPlanet } from '@vedica/ashtakavarga-engine';
import { RelativePositionClassification } from './types.js';
import { PersonalTransitAshtakavargaProfile } from './profile.js';

export interface BavEvaluation {
  planet: string;
  signName: string;
  bavPoints: number;
  bavAverage: number;
  totalPoints: number;
  classification: RelativePositionClassification;
}

export function evaluatePlanetBav(
  ashtakavarga: AshtakavargaResult,
  planet: string,
  signName: string,
  profile: PersonalTransitAshtakavargaProfile
): BavEvaluation {
  const planetKey = planet.toUpperCase() as AshtakavargaPlanet;
  const bavChart = ashtakavarga.bav?.[planetKey];

  if (!bavChart) {
    return {
      planet,
      signName,
      bavPoints: 0,
      bavAverage: 0,
      totalPoints: 0,
      classification: 'AVERAGE',
    };
  }

  // Look up raw bindu points for transit sign
  const bavPoints = bavChart.signPoints?.[signName] ?? 0;
  const totalPoints = bavChart.totalPoints || 0;
  const bavAverage = Math.round((totalPoints / 12) * 100) / 100;

  // Chart-relative classification based on profile thresholds
  let classification: RelativePositionClassification = 'AVERAGE';
  if (bavPoints < bavAverage + profile.bavAverageBand.belowOffset) {
    classification = 'BELOW_AVERAGE';
  } else if (bavPoints > bavAverage + profile.bavAverageBand.aboveOffset) {
    classification = 'ABOVE_AVERAGE';
  }

  return {
    planet,
    signName,
    bavPoints,
    bavAverage,
    totalPoints,
    classification,
  };
}
