import { PlanetName } from '@vedica/astrology-core';
import { RequiredStrengthFact } from '../types/shadbala-types.js';
import { virupasToRupas } from '../units/shadbala-units.js';

/**
 * Classical Minimum Required Shadbala Virupas (Pinda Bala requirement)
 * Source: Brihat Parasara Hora Shastra (BPHS)
 *
 * Sun: 390 Virupas (6.5 Rupas)
 * Moon: 360 Virupas (6.0 Rupas)
 * Mars: 300 Virupas (5.0 Rupas)
 * Mercury: 420 Virupas (7.0 Rupas)
 * Jupiter: 390 Virupas (6.5 Rupas)
 * Venus: 330 Virupas (5.5 Rupas)
 * Saturn: 300 Virupas (5.0 Rupas)
 */
export const REQUIRED_SHADBALA_VIRUPAS_MAP: Record<PlanetName, number> = {
  Sun: 390,
  Moon: 360,
  Mars: 300,
  Mercury: 420,
  Jupiter: 390,
  Venus: 330,
  Saturn: 300,
  Rahu: 0,
  Ketu: 0,
};

export function getRequiredStrengthFact(planet: PlanetName, isComplete: boolean = true): RequiredStrengthFact {
  const reqVirupas = REQUIRED_SHADBALA_VIRUPAS_MAP[planet] || 0;
  return {
    planet,
    requiredVirupas: reqVirupas,
    requiredRupas: virupasToRupas(reqVirupas),
    sourceVersion: 'bphs-classical-v1',
    comparisonStatus: isComplete ? 'COMPARABLE' : 'NOT_COMPARABLE',
    explanation: isComplete
      ? `Classical minimum required Shadbala for ${planet} is ${reqVirupas} Virupas (${virupasToRupas(reqVirupas)} Rupas).`
      : `Classical total required Shadbala for ${planet} is ${reqVirupas} Virupas (${virupasToRupas(reqVirupas)} Rupas). Comparison status is NOT_COMPARABLE because calculation is partial.`,
  };
}
