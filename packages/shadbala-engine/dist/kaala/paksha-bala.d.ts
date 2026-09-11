import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Paksha Bala (Fortnight / Lunar Phase Strength) according to BPHS Chapter 27.
 *
 * Formula:
 * - Elongation: θ = (Moon Longitude - Sun Longitude + 360) % 360
 * - Benefic Arc = (θ <= 180 ? θ : (360 - θ)) / 3  (Range [0, 60] Virupas)
 * - Benefics (Jupiter, Venus, Moon, unafflicted Mercury): Virupas = Benefic Arc
 * - Malefics (Sun, Mars, Saturn): Virupas = 60 - Benefic Arc
 */
export declare function calculatePakshaBala(planet: PlanetName, sunLongitude: number, moonLongitude: number): KaalaBalaSubcomponent;
