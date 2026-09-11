import { PlanetName } from '@vedica/astrology-core';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Uchcha Bala (Exaltation Strength).
 *
 * Formula:
 * 1. Find angular distance between planet's sidereal longitude and its deepest debilitation point (Paramaneecha).
 * 2. Angular distance range: 0° (at debilitation) to 180° (at exaltation).
 * 3. Uchcha Bala Virupas = angular_distance / 3.
 *    Range: 0 Virupas (at debilitation point) to 60 Virupas (at exaltation point).
 *
 * Exposes full mathematical trace.
 */
export declare function calculateUchchaBala(planet: PlanetName, longitude: number): SthanaBalaSubcomponent;
