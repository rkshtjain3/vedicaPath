import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Calculates D20 Vimsamsa position from D1 sidereal longitude.
 * D20 governs spiritual progress, worship, mantra siddhi, meditation, and inner devotion.
 * Division size: 30° / 20 = 1.5° (1° 30').
 *
 * Classical Rule (BPHS):
 * - Movable signs (Chara: Aries, Cancer, Libra, Capricorn): Count begins from Aries (1).
 * - Fixed signs (Sthira: Taurus, Leo, Scorpio, Aquarius): Count begins from Sagittarius (9).
 * - Dual signs (Dvisvabhava: Gemini, Virgo, Sagittarius, Pisces): Count begins from Leo (5).
 */
export declare function calculateVimsamsaPosition(sourceLongitude: number): DivisionalPosition;
