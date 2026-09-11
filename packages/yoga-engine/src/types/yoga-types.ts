import { PlanetName } from '@vedica/astrology-core';

export type PrimaryDignity =
  | 'EXALTED'
  | 'MOOLATRIKONA'
  | 'OWN_SIGN'
  | 'FRIENDLY_SIGN'
  | 'NEUTRAL_SIGN'
  | 'ENEMY_SIGN'
  | 'DEBILITATED';

export type LordRelationship = 'FRIENDLY' | 'NEUTRAL' | 'ENEMY';

export interface PlanetFactInput {
  planet: PlanetName;
  longitude: number;
  sign: string;
  degreeInSign: number;
  house: number;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
}

export interface HouseFactInput {
  house: number;
  sign: string;
  lord: PlanetName;
  planets: PlanetName[];
  occupied: boolean;
  occupantCount: number;
}

export interface HouseLordFactInput {
  house: number;
  lord: PlanetName;
  lordHouse: number;
  lordSign: string;
  dignity: PrimaryDignity;
  retrograde: boolean;
}

export interface ConjunctionResultInput {
  planetA: PlanetName;
  planetB: PlanetName;
  longitudeDifference: number;
  orb: number;
  detected: boolean;
}

export interface VedicAspectInput {
  fromPlanet: PlanetName;
  fromHouse: number;
  aspectNumber: number;
  toHouse: number;
  targetPlanets: PlanetName[];
}

export interface PlanetDignityInput {
  planet: PlanetName;
  sign: string;
  primaryDignity: PrimaryDignity;
  relationshipToSignLord: LordRelationship;
}

export interface ChartAnalysisResultInput {
  planetFacts: PlanetFactInput[];
  houseLordFacts: HouseLordFactInput[];
  conjunctions: ConjunctionResultInput[];
  aspects: VedicAspectInput[];
  dignities: PlanetDignityInput[];
}

export type YogaStatus = 'DETECTED' | 'NOT_DETECTED' | 'NOT_SUPPORTED';

export type YogaCategory =
  | 'MAHAPURUSHA'
  | 'RAJA'
  | 'DHANA'
  | 'LUNAR'
  | 'SPECIAL';

export type YogaChartScope = 'D1' | 'D9' | 'D10' | 'CROSS_CHART';

export interface YogaCondition {
  id: string;
  description: string;
  passed: boolean;
  result?: boolean; // Convenience alias matching passed
  expectedValue?: unknown;
  actualValue?: unknown;
  evidence: string[];
}

export type YogaEvidenceType =
  | 'PLANET_POSITION'
  | 'HOUSE_LORDSHIP'
  | 'ASPECT'
  | 'CONJUNCTION'
  | 'DIGNITY'
  | 'HOUSE_RELATIONSHIP'
  | 'CANCELLATION';

export interface YogaEvidence {
  type: YogaEvidenceType;
  sourceId?: string;
  planet?: string;
  targetPlanet?: string;
  house?: number;
  details: string[];
}

export interface YogaResult {
  id: string;
  name: string;
  category: YogaCategory;
  status: YogaStatus;
  detected: boolean; // Convenience property matching status === 'DETECTED'
  chartScope: YogaChartScope;
  conditions: YogaCondition[];
  evidence: YogaEvidence[];
  methodologyVersion: string;
  notes?: string[];
}

export interface YogaAnalysisResult {
  profileVersion: string;
  evaluatedAt: string;
  totalEvaluated: number;
  detectedCount: number;
  notDetectedCount: number;
  notSupportedCount: number;
  results: YogaResult[];
}

export interface YogaProfile {
  version: string;
  chartSystem: 'D1' | 'D9' | 'D10';
  houseSystem: 'WHOLE_SIGN';
  conjunctionOrbDegrees: number;
  enabledYogas: string[];
  mixedConditionPolicy: 'PRESERVE' | 'STRICT';
  unsupportedVariationPolicy: 'NOT_SUPPORTED' | 'IGNORE';
}
