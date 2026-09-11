import { DivisionalPosition } from '../types/divisional-types.js';
/**
 * Calculates D24 Chaturvimsamsa (Siddhamsa) position from D1 sidereal longitude.
 * D24 governs higher learning, academic achievement, knowledge, intellect, and memory.
 * Division size: 30° / 24 = 1.25° (1° 15').
 *
 * Classical Rule (BPHS):
 * - Odd signs (Visham Rashi): Count begins from Leo (Simha - 5).
 * - Even signs (Sama Rashi): Count begins from Cancer (Karka - 4).
 */
export declare function calculateChaturvimsamsaPosition(sourceLongitude: number): DivisionalPosition;
