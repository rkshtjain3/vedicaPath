export type ZodiacSystem = 'sidereal' | 'tropical';
export type AyanamsaType = 'lahiri' | 'raman' | 'krishnamurti';
export type NodeType = 'true' | 'mean';
export type HouseSystem = 'whole_sign' | 'equal' | 'placidus';
export type DashaSystem = 'vimshottari';

export interface CalculationProfile {
  version: string;
  name: string;
  zodiac: ZodiacSystem;
  ayanamsa: AyanamsaType;
  nodeType: NodeType;
  houseSystem: HouseSystem;
  dashaSystem: DashaSystem;
}

export const PERSONAL_VEDIC_V1: CalculationProfile = {
  version: 'personal-vedic-v1',
  name: 'Personal Vedic Standard v1',
  zodiac: 'sidereal',
  ayanamsa: 'lahiri',
  nodeType: 'true',
  houseSystem: 'whole_sign',
  dashaSystem: 'vimshottari',
};

export const DEFAULT_CALCULATION_PROFILE = PERSONAL_VEDIC_V1;
