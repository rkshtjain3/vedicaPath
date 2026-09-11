import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Transforms D1 sidereal longitude into D30 Trimsamsa divisional position.
 * Division sizes are irregular (5, 5, 8, 7, 5 or 5, 7, 8, 5, 5).
 */
export declare function calculateTrimsamsaPosition(sourceLongitude: number): DivisionalPosition;
