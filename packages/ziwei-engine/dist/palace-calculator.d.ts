import { EarthlyBranch, HeavenlyStem, PalaceType, ZiWeiPalace } from './types/ziwei-types.js';
export declare const EARTHLY_BRANCHES: EarthlyBranch[];
export declare const HEAVENLY_STEMS: HeavenlyStem[];
export declare const PALACE_TYPES_COUNTER_CLOCKWISE: {
    type: PalaceType;
    en: string;
    cn: string;
}[];
/**
 * Calculates Ming Gong (Life Palace) Earthly Branch Index (0..11)
 * Formula: (2 + (lunarMonth - 1) - hourBranchIndex + 12) % 12
 */
export declare function calculateMingGongBranch(lunarMonth: number, hourBranchIndex: number): number;
/**
 * Calculates Shen Gong (Body Palace) Earthly Branch Index (0..11)
 * Formula: (2 + (lunarMonth - 1) + hourBranchIndex) % 12
 */
export declare function calculateShenGongBranch(lunarMonth: number, hourBranchIndex: number): number;
/**
 * Five Tigers Chasing Stems (五虎遁)
 * Determines Heavenly Stem for Yin (Index 2) Palace based on Birth Year Stem
 */
export declare function getYinPalaceStemIndex(yearStem: HeavenlyStem): number;
/**
 * Calculates Heavenly Stem for any Branch Index (0..11)
 */
export declare function getPalaceStem(branchIndex: number, yearStem: HeavenlyStem): HeavenlyStem;
/**
 * Generates the 12 Palaces with stem/branch mapping and evidence traces
 */
export declare function generate12Palaces(lunarMonth: number, hourBranchIndex: number, yearStem: HeavenlyStem): {
    palaces: ZiWeiPalace[];
    mingGongBranchIdx: number;
    shenGongBranchIdx: number;
};
