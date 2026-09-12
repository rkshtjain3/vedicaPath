import { FourPillars, HeavenlyStemDetails, TenGodCount } from '../types/bazi-types.js';
export interface TenGodDefinition {
    name: string;
    chinese: string;
    pinyin: string;
    category: 'SELF' | 'OUTPUT' | 'WEALTH' | 'OFFICER' | 'RESOURCE';
    description: string;
    descriptionHi: string;
}
export declare function classifyTenGod(dayMaster: HeavenlyStemDetails, targetStem: HeavenlyStemDetails): TenGodDefinition;
/**
 * Assigns Ten Gods to all visible and hidden stems across the 4 pillars relative to the Day Master.
 */
export declare function populateTenGods(fourPillars: FourPillars): TenGodCount[];
