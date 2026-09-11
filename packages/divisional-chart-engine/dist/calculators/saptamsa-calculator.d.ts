import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Transforms D1 sidereal longitude into D7 Saptamsa divisional position.
 * Division size: 30° / 7 = 4.285714285714286°.
 *
 * In Parashara Saptamsa:
 * - Odd signs: Start counting from the sign itself.
 * - Even signs: Start counting from the 7th sign from it.
 */
export declare function calculateSaptamsaPosition(sourceLongitude: number): DivisionalPosition;
