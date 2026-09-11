import { BirthChart } from '@vedica/astrology-core';
import { AshtakavargaPlanet, BhinnaAshtakavarga, ShodhanaResult } from '../types/ashtakavarga-types.js';
export type RashiName = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
/**
 * Classical Rashi Gunakara (Sign Multipliers) from BPHS
 */
export declare const RASHI_GUNAKARA: Record<RashiName, number>;
/**
 * Classical Graha Gunakara (Planetary Multipliers) from BPHS
 */
export declare const GRAHA_GUNAKARA: Record<AshtakavargaPlanet, number>;
/**
 * Classical Trikona (Trine) Groups
 */
export declare const TRIKONA_GROUPS: [RashiName, RashiName, RashiName][];
/**
 * Classical Dual-Lordship Pairs for Ekadhipatya Shodhana
 */
export declare const DUAL_LORDSHIP_PAIRS: {
    planet: AshtakavargaPlanet;
    signs: [RashiName, RashiName];
}[];
/**
 * Performs Trikona Shodhana (Trine Reduction) on a single BAV.
 */
export declare function performTrikonaShodhana(signPoints: Record<string, number>): Record<string, number>;
/**
 * Gets the list of planets occupying each sign from a natal chart.
 */
export declare function getOccupiedSigns(chart: BirthChart): Record<string, string[]>;
/**
 * Performs Ekadhipatya Shodhana (Dual-Lordship Reduction) on post-Trikona bindus.
 */
export declare function performEkadhipatyaShodhana(trikonaPoints: Record<string, number>, chart: BirthChart): {
    ekadhipatyaPoints: Record<string, number>;
    explanation: string[];
};
/**
 * Calculates Rashi Pinda, Graha Pinda, and Shodhya Pinda for a reduced BAV.
 */
export declare function calculatePindas(ekadhipatyaPoints: Record<string, number>, chart: BirthChart): {
    rashiPinda: number;
    grahaPinda: number;
    shodhyaPinda: number;
};
/**
 * Performs full Shodhana (Trikona, Ekadhipatya, and Shodhya Pinda) across all 7 planets.
 */
export declare function performFullShodhana(bav: Record<AshtakavargaPlanet, BhinnaAshtakavarga>, chart: BirthChart): ShodhanaResult;
