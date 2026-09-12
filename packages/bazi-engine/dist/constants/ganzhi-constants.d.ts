import { BranchName, EarthlyBranchDetails, FiveElement, HeavenlyStemDetails, StemName } from '../types/bazi-types.js';
export declare const HEAVENLY_STEMS: Record<StemName, HeavenlyStemDetails>;
export declare const STEM_ORDER: StemName[];
export declare const EARTHLY_BRANCHES: Record<BranchName, EarthlyBranchDetails>;
export declare const BRANCH_ORDER: BranchName[];
/**
 * Five Tiger Seek Method (五虎遁): Determines the Month Stem starting from Yin (寅) Month
 * based on the Year Heavenly Stem.
 */
export declare const FIVE_TIGER_SEEK_START: Record<StemName, StemName>;
/**
 * Five Rat Seek Method (五鼠遁): Determines the Zi Hour (子时) Stem
 * based on the Day Heavenly Stem.
 */
export declare const FIVE_RAT_SEEK_START: Record<StemName, StemName>;
export declare const ELEMENT_GENERATING_CYCLE: Record<FiveElement, FiveElement>;
export declare const ELEMENT_CONTROLLING_CYCLE: Record<FiveElement, FiveElement>;
