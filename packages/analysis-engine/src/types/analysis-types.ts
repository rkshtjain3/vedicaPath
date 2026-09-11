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

export interface PlanetFact {
  planet: PlanetName;
  longitude: number;
  sign: string;
  degreeInSign: number;
  house: number;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
}

export interface HouseFact {
  house: number;
  sign: string;
  lord: PlanetName;
  planets: PlanetName[];
  occupied: boolean;
  occupantCount: number;
}

export interface HouseLordFact {
  house: number;
  lord: PlanetName;
  lordHouse: number;
  lordSign: string;
  dignity: PrimaryDignity;
  retrograde: boolean;
}

export interface ConjunctionResult {
  planetA: PlanetName;
  planetB: PlanetName;
  longitudeDifference: number;
  orb: number;
  detected: boolean;
}

export interface VedicAspect {
  fromPlanet: PlanetName;
  fromHouse: number;
  aspectNumber: number; // e.g. 3, 4, 5, 7, 8, 9, 10
  toHouse: number;
  targetPlanets: PlanetName[];
}

export interface PlanetDignity {
  planet: PlanetName;
  sign: string;
  primaryDignity: PrimaryDignity;
  relationshipToSignLord: LordRelationship;
}

export interface CombustionResult {
  planet: PlanetName;
  distanceFromSun: number;
  combustionThreshold: number;
  isCombust: boolean;
}

export interface YogaCondition {
  id: string;
  description: string;
  result: boolean;
}

export interface YogaDetectionResult {
  id: string;
  name: string;
  detected: boolean;
  conditions: YogaCondition[];
}

export interface ChartAnalysisResult {
  calculationProfileVersion: string;
  analysisProfileVersion: string;
  planetFacts: PlanetFact[];
  houseFacts: HouseFact[];
  houseLordFacts: HouseLordFact[];
  conjunctions: ConjunctionResult[];
  aspects: VedicAspect[];
  dignities: PlanetDignity[];
  combustion: CombustionResult[];
  yogas: YogaDetectionResult[];
}
