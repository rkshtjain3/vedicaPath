export const PERSONAL_TRANSIT_V1 = 'personal-transit-v1';

export interface TransitCalculationProfile {
  version: string;
  zodiac: 'sidereal';
  ayanamsa: 'lahiri' | 'raman' | 'krishnamurti';
  nodeType: 'mean' | 'true';
  conjunctionToleranceDegrees: number;
}

export const DEFAULT_TRANSIT_PROFILE: TransitCalculationProfile = {
  version: PERSONAL_TRANSIT_V1,
  zodiac: 'sidereal',
  ayanamsa: 'lahiri',
  nodeType: 'true',
  conjunctionToleranceDegrees: 6.0,
};
