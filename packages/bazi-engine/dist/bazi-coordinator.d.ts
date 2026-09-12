import { BirthChart } from '@vedica/astrology-core';
import { BaZiReport } from './types/bazi-types.js';
export interface BaZiOptions {
    gender?: 'MALE' | 'FEMALE';
    targetYear?: number;
}
/**
 * Main coordinator function producing a reproducible BaZi / Four Pillars report (`chinese-bazi-v1`).
 */
export declare function evaluateBaZi(birthChart: BirthChart, options?: BaZiOptions): BaZiReport;
