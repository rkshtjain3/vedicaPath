import { PlanetName, RashiDetails } from '@vedica/astrology-core';
import { KaalaBalaComponent } from '../types/shadbala-types.js';
export interface KaalaBalaInput {
    planet: PlanetName;
    planetPos: {
        longitude: number;
        degreeInSign?: number;
        speed?: number;
        sign?: any;
    };
    houseNumber: number;
    sunPlanetPos: {
        longitude: number;
        degreeInSign?: number;
        speed?: number;
        sign?: any;
    };
    moonPlanetPos: {
        longitude: number;
        degreeInSign?: number;
        speed?: number;
        sign?: any;
    };
    sunHouse: number;
    birthDate: Date | string;
    sunSign: RashiDetails;
    ayanamshaValue?: number;
    allPlanets: Array<{
        planet: PlanetName;
        longitude: number;
    }>;
}
/**
 * Calculates complete Kaala Bala (Temporal Strength) according to BPHS Chapter 27.
 *
 * Aggregates 6 Subcomponents:
 * 1. Nathonata Bala (Diurnal / Nocturnal)
 * 2. Paksha Bala (Lunar Fortnight)
 * 3. Tribhaga Bala (Three-part Day/Night Division)
 * 4. Varsha-Masa-Dina-Hora Bala (Periodic Temporal Lords)
 * 5. Ayana Bala (Equinoctial / Declination Strength)
 * 6. Yuddha Bala (Planetary War)
 */
export declare function calculateKaalaBala(input: KaalaBalaInput): KaalaBalaComponent;
