import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Transforms D1 sidereal longitude into D2 Hora divisional position.
 * Division size: 30° / 2 = 15°.
 *
 * In Parashara Hora:
 * - Odd signs (1, 3, 5, 7, 9, 11): 1st half is Leo (5), 2nd half is Cancer (4)
 * - Even signs (2, 4, 6, 8, 10, 12): 1st half is Cancer (4), 2nd half is Leo (5)
 */
export declare function calculateHoraPosition(sourceLongitude: number): DivisionalPosition;
