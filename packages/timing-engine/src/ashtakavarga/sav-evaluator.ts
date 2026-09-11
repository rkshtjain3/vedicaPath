import { AshtakavargaResult } from '@vedica/ashtakavarga-engine';
import { RelativePositionClassification } from './types.js';
import { PersonalTransitAshtakavargaProfile } from './profile.js';

export interface SavEvaluation {
  signName: string;
  savPoints: number;
  savAverage: number;
  classification: RelativePositionClassification;
}

export function evaluateTransitSignSav(
  ashtakavarga: AshtakavargaResult,
  signName: string,
  profile: PersonalTransitAshtakavargaProfile
): SavEvaluation {
  const savPoints = ashtakavarga.sav?.signPoints?.[signName] ?? 0;
  const savAverage = Math.round(profile.savAverage * 100) / 100;

  let classification: RelativePositionClassification = 'AVERAGE';
  if (savPoints < savAverage + profile.savAverageBand.belowOffset) {
    classification = 'BELOW_AVERAGE';
  } else if (savPoints > savAverage + profile.savAverageBand.aboveOffset) {
    classification = 'ABOVE_AVERAGE';
  }

  return {
    signName,
    savPoints,
    savAverage,
    classification,
  };
}
