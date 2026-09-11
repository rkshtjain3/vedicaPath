import { PlanetName } from '@vedica/astrology-core';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
export type DrekkanaNumber = 1 | 2 | 3;
/**
 * Determines Drekkana (1st: 0°-10°, 2nd: 10°-20°, 3rd: 20°-30°) from D1 longitude.
 */
export declare function getDrekkanaNumber(degreeInSign: number): DrekkanaNumber;
/**
 * Calculates Drekkana Bala (Decan Strength).
 *
 * Classical Rule (BPHS):
 * - Male planets (Sun, Mars, Jupiter) receive 15 Virupas in the 1st Drekkana (0°-10°).
 * - Neutral planets (Mercury, Saturn) receive 15 Virupas in the 2nd Drekkana (10°-20°).
 * - Female planets (Moon, Venus) receive 15 Virupas in the 3rd Drekkana (20°-30°).
 */
export declare function calculateDrekkanaBala(planet: PlanetName, degreeInSign: number): SthanaBalaSubcomponent;
