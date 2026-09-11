import { BirthChart, RASHIS } from '@vedica/astrology-core';
import { AshtakavargaResult } from '@vedica/ashtakavarga-engine';
import { TransitCalculationEngine } from '../transit/transit-calculator.js';
import { evaluatePlanetBav } from './bav-evaluator.js';
import { evaluateTransitSignSav } from './sav-evaluator.js';
import { buildTransitAshtakavargaEvidenceStrings } from './transit-evidence.js';
import { PERSONAL_TRANSIT_ASHTAKAVARGA_V1, PersonalTransitAshtakavargaProfile } from './profile.js';
import { TransitAshtakavargaEvidence, TransitAshtakavargaEvaluationResult } from './types.js';

export interface TransitAshtakavargaInput {
  natalChart: BirthChart;
  ashtakavarga: AshtakavargaResult;
  instant?: Date | string;
  profile?: PersonalTransitAshtakavargaProfile;
}

export async function evaluateTransitAshtakavarga(
  input: TransitAshtakavargaInput
): Promise<TransitAshtakavargaEvaluationResult> {
  const profile = input.profile || PERSONAL_TRANSIT_ASHTAKAVARGA_V1;

  let instantDate: Date;
  if (!input.instant) {
    instantDate = new Date();
  } else if (typeof input.instant === 'string') {
    instantDate = new Date(input.instant);
  } else {
    instantDate = input.instant;
  }

  const transitIsoDate = instantDate.toISOString();

  // Calculate planetary transits for instant
  const transitEngine = new TransitCalculationEngine();
  const transitPositions = await transitEngine.calculateTransit(instantDate, input.natalChart);

  const evidenceMap: Record<string, TransitAshtakavargaEvidence> = {};

  for (const planetName of profile.supportedPlanets) {
    const planetKey = planetName.toUpperCase();
    const pos = transitPositions.find(
      (p) => p.planet.toUpperCase() === planetKey
    );

    if (!pos) continue;

    const signIndex = pos.signIndex; // 1-12
    const transitSign = RASHIS[(signIndex - 1 + 12) % 12];
    const transitHouseFromLagna = pos.natalHouse;

    // Evaluate BAV & SAV
    const bavEval = evaluatePlanetBav(input.ashtakavarga, planetKey, transitSign.name, profile);
    const savEval = evaluateTransitSignSav(input.ashtakavarga, transitSign.name, profile);

    const evidenceStrings = buildTransitAshtakavargaEvidenceStrings(
      planetKey,
      transitIsoDate,
      transitSign,
      transitHouseFromLagna,
      bavEval,
      savEval
    );

    evidenceMap[planetKey] = {
      transitPlanet: planetKey,
      transitDate: transitIsoDate,
      transitSign,
      transitHouseFromLagna,
      bavPoints: bavEval.bavPoints,
      savPoints: savEval.savPoints,
      bavExpectedRange: {
        minimum: Math.max(0, Math.floor(bavEval.bavAverage + profile.bavAverageBand.belowOffset)),
        maximum: Math.min(8, Math.ceil(bavEval.bavAverage + profile.bavAverageBand.aboveOffset)),
      },
      bavAverage: bavEval.bavAverage,
      savAverage: savEval.savAverage,
      bavRelativePosition: bavEval.classification,
      savRelativePosition: savEval.classification,
      evidence: evidenceStrings,
    };
  }

  return {
    evaluatedInstant: transitIsoDate,
    evidenceMap,
    profileVersion: profile.version,
  };
}
