import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Transforms D1 sidereal longitude into D3 Drekkana divisional position.
 * Division size: 30° / 3 = 10°.
 *
 * In Parashara Drekkana:
 * - 1st part (0°-10°): Same sign
 * - 2nd part (10°-20°): 5th sign from it
 * - 3rd part (20°-30°): 9th sign from it
 */
export declare function calculateDrekkanaPosition(sourceLongitude: number): DivisionalPosition;
