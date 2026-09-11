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
export declare const PERSONAL_VEDIC_V1: CalculationProfile;
export declare const DEFAULT_CALCULATION_PROFILE: CalculationProfile;
//# sourceMappingURL=calculation-profile.d.ts.map