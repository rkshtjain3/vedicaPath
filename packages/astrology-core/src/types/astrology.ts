import { BirthTimeInput, LocationInput, UTCInstant } from '@vedica/shared';
import { CalculationProfile } from '../settings/calculation-profile.js';

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

export interface RashiDetails {
  id: number; // 1-12
  name: string; // e.g. Aries
  sanskritName: string; // e.g. Mesha
  ruler: PlanetName;
}

export interface NakshatraDetails {
  id: number; // 1-27
  name: string; // e.g. Ashwini
  ruler: PlanetName; // e.g. Ketu
  pada: number; // 1-4
}

export interface PlanetPosition {
  planet: PlanetName;
  longitude: number; // 0 to 360 decimal degrees
  sign: RashiDetails;
  degreeInSign: number; // 0 to 30 degrees
  formattedDegree: string; // e.g., "12° 34' 56\""
  nakshatra: NakshatraDetails;
  isRetrograde: boolean;
  speed: number;
  meanLongitude?: number; // Madhya Graha
  apogee?: number; // Seeghrochcha
}

export interface AscendantDetails {
  longitude: number; // 0 to 360 degrees
  sign: RashiDetails;
  degreeInSign: number; // 0 to 30 degrees
  formattedDegree: string;
  nakshatra: NakshatraDetails;
}

export interface ChartInput {
  birthTime: BirthTimeInput;
  location: LocationInput;
}

export interface BirthChart {
  input: ChartInput;
  utcInstant: UTCInstant;
  calculationProfile: CalculationProfile;
  ayanamsaValue: number;
  lagna: AscendantDetails;
  moonSign: RashiDetails;
  birthNakshatra: NakshatraDetails;
  planets: PlanetPosition[];
  calculationConfig?: {
    zodiacType: 'SIDEREAL' | 'TROPICAL';
    ayanamsha: string;
    houseSystem: string;
    nodeCalculation: 'TRUE' | 'MEAN';
    ephemerisVersion: string;
    calculationProfileVersion: string;
  };
}
