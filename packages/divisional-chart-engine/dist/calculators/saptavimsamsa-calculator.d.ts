import { DivisionalPosition, ElementCategory } from '../types/divisional-types.js';
export declare function getElementCategory(rashiId: number): ElementCategory;
/**
 * Calculates D27 Saptavimsamsa (Bhamsa / Nakshatramsa) position from D1 sidereal longitude.
 * D27 governs physical strength, stamina, fortitude, hidden potentials, and subconscious weaknesses.
 * Division size: 30° / 27 = 1° 06' 40" (1.111111°).
 *
 * Classical Rule (BPHS):
 * - Fiery signs (Agni Rashi: Aries, Leo, Sagittarius): Count begins from Aries (1).
 * - Earthy signs (Prithvi Rashi: Taurus, Virgo, Capricorn): Count begins from Cancer (4).
 * - Airy signs (Vayu Rashi: Gemini, Libra, Aquarius): Count begins from Libra (7).
 * - Watery signs (Jala Rashi: Cancer, Scorpio, Pisces): Count begins from Capricorn (10).
 */
export declare function calculateSaptavimsamsaPosition(sourceLongitude: number): DivisionalPosition;
