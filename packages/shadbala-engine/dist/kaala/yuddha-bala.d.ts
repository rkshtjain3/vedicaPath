import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Yuddha Bala (Planetary War Strength) according to BPHS Chapter 27.
 *
 * Rules:
 * - Planetary War occurs only between non-luminary planets (Mars, Mercury, Jupiter, Venus, Saturn)
 *   when their mutual longitudinal separation is less than 1.0°.
 * - If not in planetary war, Yuddha Bala is 0.0 Virupas.
 */
export declare function calculateYuddhaBala(planet: PlanetName, planetLongitude: number, allPlanets: Array<{
    planet: PlanetName;
    longitude: number;
}>): KaalaBalaSubcomponent;
