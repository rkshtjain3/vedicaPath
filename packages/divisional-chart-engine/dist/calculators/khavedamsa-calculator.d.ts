import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Calculates D40 Khavedamsa (Chatvarimsamsa) position from D1 sidereal longitude.
 * D40 governs auspicious and inauspicious effects, paternal legacy, and ancestral virtues/debts.
 * Division size: 30° / 40 = 0.75° (0° 45').
 *
 * Classical Rule (BPHS):
 * - Odd signs (Visham Rashi): Count begins from Aries (Mesha - 1).
 * - Even signs (Sama Rashi): Count begins from Libra (Tula - 7).
 */
export declare function calculateKhavedamsaPosition(sourceLongitude: number): DivisionalPosition;
