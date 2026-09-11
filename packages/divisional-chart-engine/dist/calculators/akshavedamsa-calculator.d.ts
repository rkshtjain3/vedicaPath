import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Calculates D45 Akshavedamsa position from D1 sidereal longitude.
 * D45 governs all general matters, moral character, purity, ethical conduct, and auspiciousness.
 * Division size: 30° / 45 = 0° 40' (0.666667°).
 *
 * Classical Rule (BPHS):
 * - Movable signs (Chara: Aries, Cancer, Libra, Capricorn): Count begins from Aries (1).
 * - Fixed signs (Sthira: Taurus, Leo, Scorpio, Aquarius): Count begins from Leo (5).
 * - Dual signs (Dvisvabhava: Gemini, Virgo, Sagittarius, Pisces): Count begins from Sagittarius (9).
 */
export declare function calculateAkshavedamsaPosition(sourceLongitude: number): DivisionalPosition;
