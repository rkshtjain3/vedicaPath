import { DivisionalPosition, SignCategory } from '../types/divisional-types.js';
/**
 * Returns the sign category (Movable, Fixed, Dual) for a 1-based Rashi ID (1-12).
 * Movable (Chara): Aries (1), Cancer (4), Libra (7), Capricorn (10)
 * Fixed (Sthira): Taurus (2), Leo (5), Scorpio (8), Aquarius (11)
 * Dual (Dwisvabhava): Gemini (3), Virgo (6), Sagittarius (9), Pisces (12)
 */
export declare function getSignCategory(rashiId: number): SignCategory;
/**
 * Calculates the starting sign (1-12) for D9 Navamsa division sequence.
 * - Movable signs start from the sign itself (1st sign).
 * - Fixed signs start from the 9th sign.
 * - Dual signs start from the 5th sign.
 */
export declare function getNavamsaStartSign(rashiId: number): number;
/**
 * Transforms D1 sidereal longitude into D9 Navamsa divisional position.
 * Division size: 30° / 9 = 3° 20' = 3.3333333333333335°.
 * Full floating point accuracy is preserved without intermediate rounding.
 */
export declare function calculateNavamsaPosition(sourceLongitude: number): DivisionalPosition;
