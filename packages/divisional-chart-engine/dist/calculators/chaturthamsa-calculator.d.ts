import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Calculates D4 Chaturthamsa (Turyamsa) position from D1 sidereal longitude.
 * D4 governs fixed assets, property, home, happiness, and mother/inheritance.
 * Division size: 30° / 4 = 7°30' = 7.5°.
 *
 * Classical Rule (BPHS):
 * 1st quarter (0° - 7.5°): 1st house (Same sign)
 * 2nd quarter (7.5° - 15.0°): 4th house from sign
 * 3rd quarter (15.0° - 22.5°): 7th house from sign
 * 4th quarter (22.5° - 30.0°): 10th house from sign
 */
export declare function calculateChaturthamsaPosition(sourceLongitude: number): DivisionalPosition;
