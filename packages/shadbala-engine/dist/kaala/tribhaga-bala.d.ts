import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Tribhaga Bala (Three-part Day/Night Division Strength) according to BPHS Chapter 27.
 *
 * Rules:
 * - Day Portions:
 *   1st part: Mercury (60 Virupas)
 *   2nd part: Sun (60 Virupas)
 *   3rd part: Saturn (60 Virupas)
 * - Night Portions:
 *   1st part: Moon (60 Virupas)
 *   2nd part: Venus (60 Virupas)
 *   3rd part: Mars (60 Virupas)
 * - Jupiter always receives 60 Virupas.
 */
export declare function calculateTribhagaBala(planet: PlanetName, sunHouse: number, decimalHourOfDay?: number): KaalaBalaSubcomponent;
