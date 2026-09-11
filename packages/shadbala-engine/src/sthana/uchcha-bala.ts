import { PlanetName } from '@vedica/astrology-core';
import { EXALTATION_DEBILITATION_POINTS } from '../constants/exaltation-points.js';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
import { virupasToRupas, angularDistance180 } from '../units/shadbala-units.js';

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
export function calculateUchchaBala(planet: PlanetName, longitude: number): SthanaBalaSubcomponent {
  const points = EXALTATION_DEBILITATION_POINTS[planet];

  if (!points || planet === 'Rahu' || planet === 'Ketu') {
    return {
      name: 'Uchcha Bala',
      subcomponentName: 'UCHCHA_BALA',
      virupas: 0,
      rupas: 0,
      formulaVersion: 'bphs-uchcha-v1',
      status: 'IMPLEMENTED_UNBENCHMARKED',
      inputs: { planet, longitude },
      evidence: [`${planet} does not receive standard classical Uchcha Bala in Phase 13A`],
    };
  }

  // Calculate shortest angular distance from debilitation longitude
  const angularDistFromDebilitation = angularDistance180(longitude, points.debilitationLongitude);
  const virupas = angularDistFromDebilitation / 3;
  const rupas = virupasToRupas(virupas);

  const evidence = [
    `Planet: ${planet}`,
    `Longitude: ${longitude.toFixed(2)}°`,
    `Exaltation Point: ${points.exaltationSign} ${points.exaltationDegree}° (${points.exaltationLongitude}°)`,
    `Debilitation Point: ${points.debilitationSign} ${points.debilitationDegree}° (${points.debilitationLongitude}°)`,
    `Angular Distance from Debilitation: ${angularDistFromDebilitation.toFixed(2)}°`,
    `Formula: distance / 3 = ${angularDistFromDebilitation.toFixed(2)}° / 3`,
    `Result: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`,
  ];

  return {
    name: 'Uchcha Bala',
    subcomponentName: 'UCHCHA_BALA',
    virupas,
    rupas,
    formulaVersion: 'bphs-uchcha-v1',
    status: 'IMPLEMENTED_UNBENCHMARKED',
    inputs: {
      planet,
      longitude,
      exaltationLongitude: points.exaltationLongitude,
      debilitationLongitude: points.debilitationLongitude,
      angularDistFromDebilitation,
    },
    evidence,
  };
}
