import { BirthChart } from '@vedica/astrology-core';
import { BranchName, FourPillars } from '../types/bazi-types.js';
export interface SolarTermInfo {
    termName: string;
    monthBranch: BranchName;
    targetLongitude: number;
}
export declare const SOLAR_TERMS_12: SolarTermInfo[];
export declare function getTropicalSunLongitude(chart: BirthChart): number;
export declare function resolveSolarTermMonth(sunLongitude: number): SolarTermInfo;
export declare function calculateJulianDayNumber(utcIsoString: string): number;
export declare function calculateDayGanzhiIndex(jdn: number): number;
export interface FourPillarsOptions {
    lateZiConvention?: 'LATE_ZI_SAME_DAY' | 'LATE_ZI_NEXT_DAY';
}
export declare function calculateFourPillars(chart: BirthChart, options?: FourPillarsOptions): FourPillars;
