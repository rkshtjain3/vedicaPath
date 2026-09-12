import { HeavenlyStem, SiHuaTransformation, ZiWeiPalace } from './types/ziwei-types.js';
export declare const SIHUA_TABLE: Record<HeavenlyStem, {
    lu: string;
    quan: string;
    ke: string;
    ji: string;
}>;
export declare function calculateSiHuaTransformations(yearStem: HeavenlyStem): SiHuaTransformation[];
export declare function attachSiHuaToPalaces(palaces: ZiWeiPalace[], siHuaList: SiHuaTransformation[]): void;
