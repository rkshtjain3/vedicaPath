import { DivisionalPosition } from '../types/divisional-types.js';
export interface ShashtyamsaDeity {
    index: number;
    name: string;
    isAuspicious: boolean;
}
export declare const SHASHTYAMSA_DEITIES: ShashtyamsaDeity[];
/**
 * Calculates D60 Shashtyamsa position and deity from D1 sidereal longitude.
 * D60 is considered the supreme divisional chart in Parashara Jyotish (highest Vimsopaka weight = 4.0/20),
 * revealing deep past-life karma and the ultimate destiny/fruits of planetary energies.
 * Division size: 30° / 60 = 0.5° (0° 30').
 *
 * Classical Rule (BPHS):
 * - Sign: Count begins from the sign itself (1st) and proceeds directly.
 * - Deities: Odd signs count forward from 1 to 60. Even signs count in reverse from 60 down to 1.
 */
export declare function calculateShashtyamsaPosition(sourceLongitude: number): DivisionalPosition;
