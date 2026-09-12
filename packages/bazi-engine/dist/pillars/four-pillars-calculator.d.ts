import { BirthChart } from '@vedica/astrology-core';
import { BranchName, FourPillars } from '../types/bazi-types.js';
export interface SolarTermInfo {
    termName: string;
    monthBranch: BranchName;
    targetLongitude: number;
}
export declare const SOLAR_TERMS_12: SolarTermInfo[];
/**
 * Calculates tropical Sun longitude from birth chart sidereal longitude & ayanamsha.
 */
export declare function getTropicalSunLongitude(chart: BirthChart): number;
/**
 * Resolves the 12 Solar Months (Jie Qi) based on Tropical Sun Longitude.
 */
export declare function resolveSolarTermMonth(sunLongitude: number): SolarTermInfo;
/**
 * Calculates Julian Day Number (JDN) from UTC Instant.
 */
export declare function calculateJulianDayNumber(utcIsoString: string): number;
/**
 * Computes Day Ganzhi index (0 to 59) from JDN.
 */
export declare function calculateDayGanzhiIndex(jdn: number): number;
/**
 * Calculates the Four Pillars of Destiny (Year, Month, Day, Hour) with explicit evidence traces.
 */
export declare function calculateFourPillars(chart: BirthChart): FourPillars;
