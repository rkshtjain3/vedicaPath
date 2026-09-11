import { PlanetName, RashiDetails } from '@vedica/astrology-core';
import { PrimaryDignity } from '@vedica/analysis-engine';

export type DivisionalChartType =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D7'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60';

export type SignCategory = 'MOVABLE' | 'FIXED' | 'DUAL';
export type ElementCategory = 'FIRE' | 'EARTH' | 'AIR' | 'WATER';

export interface DivisionalChartProfile {
  type: DivisionalChartType;
  division: number;
  name: string;
  sanskritName: string;
  significance: string;
  significanceHi: string;
  vimsopakaWeight: {
    shadvarga?: number;
    saptavarga?: number;
    dasavarga?: number;
    shodashavarga: number;
  };
  enabled: boolean;
}

export interface DivisionalPosition {
  sign: RashiDetails;
  longitudeInSign: number; // 0° to 30° rescaled within divisional sign
  formattedDegree: string; // e.g. "12° 34' 56\""
  absoluteLongitude: number; // 0° to 360° divisional longitude
  sourceLongitude: number; // Original D1 sidereal longitude
  divisionNumber: number; // 1-based division index within sign (1 to N)
  deityName?: string; // Specific deity/ruler if applicable (e.g. for D60)
  isAuspicious?: boolean; // Benefic or malefic nature (e.g. for D60)
}

export interface DivisionalHouse {
  house: number; // 1 to 12
  sign: RashiDetails;
  occupants: PlanetName[];
  lord: PlanetName;
}

export interface DivisionalChart {
  type: DivisionalChartType;
  division: number; // e.g. 4 for D4, 60 for D60
  profileVersion: string; // e.g. 'personal-d4-v1'
  ascendant: DivisionalPosition;
  planets: Record<PlanetName, DivisionalPosition>;
  houses: DivisionalHouse[];
}

export interface DivisionalPlanetAnalysis {
  planet: PlanetName;
  position: DivisionalPosition;
  house: number;
  dignity: PrimaryDignity;
}

export interface DivisionalChartAnalysis {
  chartType: DivisionalChartType;
  ascendant: DivisionalPosition;
  planets: DivisionalPlanetAnalysis[];
  houses: DivisionalHouse[];
}

// Vimsopaka Bala Types
export type VimsopakaScheme = 'SHADVARGA' | 'SAPTAVARGA' | 'DASAVARGA' | 'SHODASHAVARGA';

export interface VimsopakaVargaScore {
  chartType: DivisionalChartType;
  weight: number;
  sign: RashiDetails;
  dignity: PrimaryDignity;
  scoreRatio: number; // 0.0 to 1.0 (e.g., 20/20 for Exaltation, 15/20 for Swa, etc.)
  weightedScore: number; // weight * scoreRatio
}

export interface PlanetVimsopakaBala {
  planet: PlanetName;
  score: number; // Total points out of 20
  percentage: number; // 0 to 100%
  grade: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'WEAK';
  vargaScores: VimsopakaVargaScore[];
}

export interface VimsopakaBalaReport {
  scheme: VimsopakaScheme;
  planets: Record<PlanetName, PlanetVimsopakaBala>;
  ranking: { planet: PlanetName; score: number }[];
}

// Comparison & Cross Chart Types
export interface VargaComparisonItem {
  entity: PlanetName | 'Ascendant';
  d1Sign: RashiDetails;
  d9Sign: RashiDetails;
  d1House: number;
  d9House: number;
  d1Dignity: string;
  d9Dignity: string;
  isVargottama: boolean;
  explanation: string;
}

export interface VargaComparisonResult {
  ascendantVargottama: boolean;
  vargottamaPlanets: PlanetName[];
  items: VargaComparisonItem[];
}

export interface VargaDashamsaComparisonItem {
  entity: PlanetName | 'Ascendant';
  d1Sign: RashiDetails;
  d10Sign: RashiDetails;
  d1House: number;
  d10House: number;
  d1Dignity: string;
  d10Dignity: string;
  sameD1D10Sign: boolean;
  explanation: string;
}

export interface VargaDashamsaComparisonResult {
  ascendantSameSign: boolean;
  sameSignPlanets: PlanetName[];
  items: VargaDashamsaComparisonItem[];
}

export interface CareerIndicatorFact {
  planet: PlanetName;
  sign: RashiDetails;
  house: number;
  dignity: string;
}

export interface CareerCrossChartItem {
  planet: PlanetName;
  d1Sign: RashiDetails;
  d1House: number;
  d1Dignity: string;
  d10Sign: RashiDetails;
  d10House: number;
  d10Dignity: string;
  sameD1D10Sign: boolean;
  vargottama: boolean;
  d1StrengthScore?: number;
  d1StrengthClassification?: string;
  whyEvidence: string[];
}

export interface CareerCrossChartAnalysis {
  d1TenthHouse: {
    sign: RashiDetails;
    lord: PlanetName;
    occupants: PlanetName[];
  };
  d10TenthHouse: {
    sign: RashiDetails;
    lord: PlanetName;
    occupants: PlanetName[];
  };
  d1TenthLord: CareerIndicatorFact;
  d10TenthLord: CareerIndicatorFact;
  d1SixthLord: CareerIndicatorFact;
  d10SixthLord: CareerIndicatorFact;
  d1EleventhLord: CareerIndicatorFact;
  d10EleventhLord: CareerIndicatorFact;
  d10Ascendant: {
    sign: RashiDetails;
    lord: PlanetName;
  };
  crossChartPlanets: CareerCrossChartItem[];
}
