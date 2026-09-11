import { PlanetName, RashiDetails } from '@vedica/astrology-core';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
export type PlanetGenderCategory = 'MALE' | 'FEMALE' | 'NEUTRAL';
export declare const PLANET_GENDER_CATEGORIES: Record<PlanetName, PlanetGenderCategory>;
/**
 * Calculates Ojayugmarasyamsa Bala (Odd/Even Sign Strength).
 *
 * Classical Methodology:
 * - Male planets (Sun, Mars, Jupiter) & Neutral planets (Mercury, Saturn) receive 15 Virupas for placement in Odd signs (1, 3, 5, 7, 9, 11) in D1 and D9.
 * - Female planets (Moon, Venus) receive 15 Virupas for placement in Even signs (2, 4, 6, 8, 10, 12) in D1 and D9.
 * Maximum score: 30 Virupas (15 from D1 + 15 from D9).
 */
export declare function calculateOjayugmaBala(planet: PlanetName, d1Sign: RashiDetails, d9Sign?: RashiDetails): SthanaBalaSubcomponent;
