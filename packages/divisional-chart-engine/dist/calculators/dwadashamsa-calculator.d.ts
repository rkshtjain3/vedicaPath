import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Transforms D1 sidereal longitude into D12 Dwadashamsa divisional position.
 * Division size: 30° / 12 = 2.5°.
 *
 * In Parashara Dwadashamsa:
 * - Always start counting from the sign itself sequentially.
 */
export declare function calculateDwadashamsaPosition(sourceLongitude: number): DivisionalPosition;
