import { EarthlyBranch, HeavenlyStem, ZiWeiPalace, StarBrightness } from './types/ziwei-types.js';
export declare function calculateZiWeiBranchIndex(lunarDay: number, bureauNumber: number): number;
export declare function calculateTianFuBranchIndex(ziWeiBranchIndex: number): number;
export declare const MAJOR_STARS_META: {
    id: string;
    nameEn: string;
    nameCn: string;
    group: string;
}[];
export declare function getStarBrightness(starId: string, branchIndex: number): StarBrightness;
export declare function populateStarsInPalaces(palaces: ZiWeiPalace[], lunarDay: number, bureauNumber: number, lunarMonth: number, hourBranchIndex: number, yearStem: HeavenlyStem, yearBranch: EarthlyBranch): {
    ziWeiBranchIdx: number;
    tianFuBranchIdx: number;
};
