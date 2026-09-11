import { PlanetLord } from '../vimshottari/canonical-vimshottari.js';
export type YoginiName = 'MANGALA' | 'PINGALA' | 'DHANYA' | 'BHRAMARI' | 'BHADRIKA' | 'ULKA' | 'SIDDHA' | 'SANKATA';
export interface YoginiMetadata {
    name: YoginiName;
    sanskritName: string;
    hindiName: string;
    lord: PlanetLord;
    years: number;
    nature: 'BENEFIC' | 'MALEFIC';
    deity: string;
    significations: string;
}
export declare const TOTAL_YOGINI_YEARS = 36;
export declare const YOGINI_CYCLE: readonly YoginiMetadata[];
/**
 * Returns the starting Yogini based on Janma Nakshatra index (0-26).
 * Classical rule: (Nakshatra Number (1-27) + 3) mod 8.
 * If remainder is 0, it maps to 8th Yogini (Sankata).
 */
export declare function getStartingYoginiFromNakshatra(nakshatraIndex0Based: number): YoginiMetadata;
//# sourceMappingURL=canonical-yogini.d.ts.map