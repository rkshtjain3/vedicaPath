import { BirthTimeInput, LocationInput, UTCInstant } from '@vedica/shared';
import { CalculationProfile } from '../settings/calculation-profile.js';
export type PlanetName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export interface RashiDetails {
    id: number;
    name: string;
    sanskritName: string;
    ruler: PlanetName;
}
export interface NakshatraDetails {
    id: number;
    name: string;
    ruler: PlanetName;
    pada: number;
}
export interface PlanetPosition {
    planet: PlanetName;
    longitude: number;
    sign: RashiDetails;
    degreeInSign: number;
    formattedDegree: string;
    nakshatra: NakshatraDetails;
    isRetrograde: boolean;
    speed: number;
    meanLongitude?: number;
    apogee?: number;
}
export interface AscendantDetails {
    longitude: number;
    sign: RashiDetails;
    degreeInSign: number;
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
//# sourceMappingURL=astrology.d.ts.map