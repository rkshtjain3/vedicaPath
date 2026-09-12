import { BirthChart } from '@vedica/astrology-core';
import { TransitAnalysisOutput } from './types.js';
export interface DoubleTransitLockResult {
    house: number;
    sign: string;
    hasDoubleTransitLock: boolean;
    jupiterInfluence: string;
    saturnInfluence: string;
    significance: string;
}
export interface DoubleTransitLockAnalysis {
    locks: DoubleTransitLockResult[];
    lockedHousesCount: number;
    summary: string;
}
export declare function detectDoubleTransitLock(natalChart: BirthChart, transitAnalysis: TransitAnalysisOutput): DoubleTransitLockAnalysis;
