import { AshtakavargaPlanet, BhinnaAshtakavarga, Sarvashtakavarga } from '../types/ashtakavarga-types.js';
/**
 * Calculates Sarvashtakavarga (SAV) by summing sign bindus across all 7 planetary BAVs.
 *
 * NOTE: Lagna is NOT an 8th BAV row in SAV summation.
 * Lagna contributes internally within each planet's 8-contributor BAV matrix.
 * SAV is strictly the sum of the seven planetary BAV sign totals.
 */
export declare function calculateSAV(bavMap: Record<AshtakavargaPlanet, BhinnaAshtakavarga>): Sarvashtakavarga;
