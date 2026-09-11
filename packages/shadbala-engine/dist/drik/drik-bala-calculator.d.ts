import { PlanetName } from '@vedica/astrology-core';
import { ShadbalaComponent } from '../types/shadbala-types.js';
export interface AspectDetail {
    aspectingPlanet: PlanetName;
    angleDegrees: number;
    drushtiVirupas: number;
    isBenefic: boolean;
    netContributionVirupas: number;
}
/**
 * Calculates Drik Bala (Aspectual / Drushti Strength) according to BPHS Chapter 27.
 *
 * Each planet receives aspects from all other planets based on angular distance (Drushti Kendra).
 * - Benefic aspects (Jupiter, Venus, Moon, Mercury) add positive Drik Virupas (+1/4 Drushti value).
 * - Malefic aspects (Sun, Mars, Saturn) add negative Drik Virupas (-1/4 Drushti value).
 */
export declare function calculateDrikBala(planet: PlanetName, planetLongitude: number, allPlanets: Array<{
    planet: PlanetName;
    longitude: number;
}>): ShadbalaComponent;
