import { PlanetName } from '@vedica/astrology-core';

export type OverallStrength =
  | 'VERY_STRONG'
  | 'STRONG'
  | 'MODERATE'
  | 'WEAK'
  | 'VERY_WEAK';

export type FactorEffect = 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL';

export interface StrengthFactor {
  id: string;
  category: string;
  effect: FactorEffect;
  scoreContribution: number;
  evidence: string[];
}

export interface PlanetStrengthAnalysis {
  planet: PlanetName;
  overallStrength: OverallStrength;
  factors: StrengthFactor[];
  score: number;
  profileVersion: string;
  d1Dignity: string;
  d9Dignity?: string;
  house: number;
  houseCategories: string[];
  isCombust: boolean;
  isRetrograde: boolean;
  isVargottama: boolean;
}

export type BasicRelationship = 'FRIEND' | 'NEUTRAL' | 'ENEMY';
export type CompoundRelationship =
  | 'GREAT_FRIEND'
  | 'FRIEND'
  | 'NEUTRAL'
  | 'ENEMY'
  | 'GREAT_ENEMY';

export interface CompoundRelationshipResult {
  planetA: PlanetName;
  planetB: PlanetName;
  naturalRelationship: BasicRelationship;
  temporaryRelationship: 'FRIEND' | 'ENEMY';
  compoundRelationship: CompoundRelationship;
  explanation: string;
}

export type RelationshipMatrix = Record<
  string,
  Record<string, CompoundRelationshipResult>
>;

export interface StrengthAnalysisResult {
  planets: PlanetStrengthAnalysis[];
  relationships: RelationshipMatrix;
  profileVersion: string;
}

export interface StrengthProfile {
  version: string;
  weights: {
    EXALTED: number;
    MOOLATRIKONA: number;
    OWN_SIGN: number;
    GREAT_FRIEND_SIGN: number;
    FRIENDLY_SIGN: number;
    NEUTRAL_SIGN: number;
    ENEMY_SIGN: number;
    GREAT_ENEMY_SIGN: number;
    DEBILITATED: number;
    KENDRA_HOUSE: number;
    TRIKONA_HOUSE: number;
    UPACHAYA_HOUSE: number;
    DUSTHANA_HOUSE: number;
    VARGOTTAMA: number;
    COMBUSTION: number;
    RETROGRADE_DEFAULT: number;
    BENEFIC_ASPECT: number;
    MALEFIC_ASPECT: number;
  };
  thresholds: {
    VERY_STRONG: number;
    STRONG: number;
    MODERATE: number;
    WEAK: number;
    VERY_WEAK: number;
  };
}
