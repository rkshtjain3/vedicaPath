import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Ayana Bala (Equinoctial / Declination Strength) according to BPHS Chapter 27.
 *
 * Formula:
 * - Sayana Longitude: λ_sayana = (λ_sidereal + 23.85) % 360
 * - Declination proxy: δ = 23.44° * sin(λ_sayana * π / 180)
 * - Northern Declination (δ > 0) favors Sun, Mars, Jupiter, Venus.
 * - Southern Declination (δ < 0) favors Moon, Saturn.
 * - Mercury is balanced.
 * - Range: [0, 60] Virupas.
 */
export declare function calculateAyanaBala(planet: PlanetName, siderealLongitude: number, ayanamshaValue?: number): KaalaBalaSubcomponent;
