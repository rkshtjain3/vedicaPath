import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Calculates D16 Shodashamsa (Kalamsa) position from D1 sidereal longitude.
 * D16 governs vehicles, conveyances, general happiness, luxury, and comforts.
 * Division size: 30° / 16 = 1.875° (1° 52' 30").
 *
 * Classical Rule (BPHS):
 * - Movable signs (Chara: Aries, Cancer, Libra, Capricorn): Count begins from Aries (1).
 * - Fixed signs (Sthira: Taurus, Leo, Scorpio, Aquarius): Count begins from Leo (5).
 * - Dual signs (Dvisvabhava: Gemini, Virgo, Sagittarius, Pisces): Count begins from Sagittarius (9).
 */
export declare function calculateShodashamsaPosition(sourceLongitude: number): DivisionalPosition;
