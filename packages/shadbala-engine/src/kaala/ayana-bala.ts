import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
import { virupasToRupas } from '../units/shadbala-units.js';

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
export function calculateAyanaBala(
  planet: PlanetName,
  siderealLongitude: number,
  ayanamshaValue: number = 23.85
): KaalaBalaSubcomponent {
  const sayanaLongitude = (siderealLongitude + ayanamshaValue) % 360;
  const rad = (sayanaLongitude * Math.PI) / 180;
  const declinationDegrees = 23.44 * Math.sin(rad); // Approx declination in [-23.44, +23.44]

  let virupas = 30; // Midpoint baseline

  if (planet === 'Sun' || planet === 'Mars' || planet === 'Jupiter' || planet === 'Venus') {
    // Northern declination favored: +23.44° -> 60 Virupas, -23.44° -> 0 Virupas
    virupas = 30 + (declinationDegrees / 23.44) * 30;
  } else if (planet === 'Moon' || planet === 'Saturn') {
    // Southern declination favored: -23.44° -> 60 Virupas, +23.44° -> 0 Virupas
    virupas = 30 - (declinationDegrees / 23.44) * 30;
  } else if (planet === 'Mercury') {
    // Mercury is moderately northern: 30 + δ/2
    virupas = 30 + (declinationDegrees / 23.44) * 15;
  }

  virupas = Math.max(0, Math.min(60, virupas));
  const rupas = virupasToRupas(virupas);

  const evidence = [
    `Sayana Longitude: ${sayanaLongitude.toFixed(2)}° (Declination Proxy: ${declinationDegrees.toFixed(2)}°)`,
    `Ayana Orientation: ${declinationDegrees >= 0 ? 'Uttarayana (Northern)' : 'Dakshinayana (Southern)'}`,
    `Ayana Bala: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`,
  ];

  return {
    name: 'Ayana Bala',
    subcomponentName: 'AYANA_BALA',
    virupas,
    rupas,
    formulaVersion: 'bphs-ayana-v1',
    status: 'IMPLEMENTED_UNBENCHMARKED',
    inputs: { planet, siderealLongitude, ayanamshaValue, declinationDegrees },
    evidence,
  };
}
