import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Determines whether a Rashi ID (1-12) is an Odd sign or an Even sign.
 * Odd signs (Visham Rashi): Aries (1), Gemini (3), Leo (5), Libra (7), Sagittarius (9), Aquarius (11)
 * Even signs (Sama Rashi): Taurus (2), Cancer (4), Virgo (6), Scorpio (8), Capricorn (10), Pisces (12)
 */
export declare function isOddSign(rashiId: number): boolean;
/**
 * Calculates the starting sign (1-12) for D10 Dashamsa division sequence.
 * - Odd signs start from the sign itself (1st sign).
 * - Even signs start from the 9th sign counted from the sign itself.
 */
export declare function getDashamsaStartSign(rashiId: number): number;
/**
 * Transforms D1 sidereal longitude into D10 Dashamsa divisional position.
 * Division size: 30° / 10 = 3° = 3.0°.
 * Full floating point accuracy is preserved without intermediate rounding.
 */
export declare function calculateDashamsaPosition(sourceLongitude: number): DivisionalPosition;
