import { PlanetName } from '@vedica/astrology-core';
import { ShadbalaComponent, DigBalaMethodology } from '../types/shadbala-types.js';
export interface DigBalaDirectionPoint {
    planet: PlanetName;
    strongestHouse: number;
    strongestDirection: 'EAST' | 'SOUTH' | 'WEST' | 'NORTH';
    zeroHouse: number;
    zeroLongitudeOffsetFromAscendant: number;
}
/**
 * Classical Directional Strength (Dig Bala) Planetary Points
 *
 * Mercury & Jupiter: Strongest in East (House 1 / Lagna) -> Zero point in West (House 7 / Descendant)
 * Sun & Mars: Strongest in South (House 10 / MC) -> Zero point in North (House 4 / IC)
 * Saturn: Strongest in West (House 7 / Descendant) -> Zero point in East (House 1 / Lagna)
 * Moon & Venus: Strongest in North (House 4 / IC) -> Zero point in South (House 10 / MC)
 *
 * Source: BPHS Dig Bala Adhyaya.
 */
export declare const DIG_BALA_POINTS: Record<PlanetName, DigBalaDirectionPoint>;
/**
 * Calculates Dig Bala (Directional Strength).
 *
 * Methodology: `EXACT_ANGULAR`
 * 1. Determine the exact zero-strength longitude for the planet relative to Ascendant longitude.
 *    - Mercury / Jupiter: Zero point = Ascendant + 180° (House 7 Cusp)
 *    - Sun / Mars: Zero point = Ascendant + 90° (House 4 Cusp)
 *    - Saturn: Zero point = Ascendant + 0° (House 1 Cusp)
 *    - Moon / Venus: Zero point = Ascendant + 270° (House 10 Cusp)
 * 2. Calculate angular distance between planet's longitude and its zero-strength longitude.
 * 3. Dig Bala Virupas = angular_distance / 3.
 *    Max Dig Bala = 180° / 3 = 60 Virupas.
 */
export declare function calculateDigBala(planet: PlanetName, planetLongitude: number, ascendantLongitude: number, methodology?: DigBalaMethodology): ShadbalaComponent;
