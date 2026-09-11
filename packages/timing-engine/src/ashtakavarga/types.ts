import { RashiDetails } from '@vedica/astrology-core';

export type TransitAshtakavargaPlanet = 'JUPITER' | 'SATURN' | string;

export type RelativePositionClassification =
  | 'BELOW_AVERAGE'
  | 'AVERAGE'
  | 'ABOVE_AVERAGE';

export interface TransitAshtakavargaEvidence {
  transitPlanet: TransitAshtakavargaPlanet;
  transitDate: string;
  transitSign: RashiDetails;
  transitHouseFromLagna: number;
  bavPoints: number;
  savPoints: number;
  bavExpectedRange?: {
    minimum: number;
    maximum: number;
  };
  bavAverage: number;
  savAverage: number;
  bavRelativePosition: RelativePositionClassification;
  savRelativePosition: RelativePositionClassification;
  evidence: string[];
}

export interface TransitAshtakavargaEvaluationResult {
  evaluatedInstant: string;
  evidenceMap: Record<string, TransitAshtakavargaEvidence>;
  profileVersion: string;
}
