import { PlanetName, PlanetPosition } from '@vedica/astrology-core';
import { ShadbalaComponent } from '../types/shadbala-types.js';
import { virupasToRupas } from '../units/shadbala-units.js';

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
export function calculateDrikBala(
  planet: PlanetName,
  planetLongitude: number,
  allPlanets: Array<{ planet: PlanetName; longitude: number }>
): ShadbalaComponent {
  let totalVirupas = 0;
  const aspectDetails: AspectDetail[] = [];
  const evidence: string[] = [`Planet: ${planet} (Drik Bala / Aspectual Strength Evaluation)`];

  for (const other of allPlanets) {
    if (other.planet === planet) continue;

    // Drushti Kendra = (Aspected - Aspecting + 360) % 360
    const angle = ((planetLongitude - other.longitude + 360) % 360);
    const drushtiVirupas = calculateParashariDrushti(other.planet, angle);

    if (drushtiVirupas > 0) {
      const isBenefic = other.planet === 'Jupiter' || other.planet === 'Venus' || other.planet === 'Moon' || other.planet === 'Mercury';
      const netContribution = isBenefic ? (drushtiVirupas / 4) : -(drushtiVirupas / 4);

      totalVirupas += netContribution;
      aspectDetails.push({
        aspectingPlanet: other.planet,
        angleDegrees: angle,
        drushtiVirupas,
        isBenefic,
        netContributionVirupas: netContribution,
      });

      evidence.push(
        `Aspect from ${other.planet} (Separation: ${angle.toFixed(1)}°): Raw Drushti = ${drushtiVirupas.toFixed(1)} Virupas -> ${isBenefic ? 'Benefic' : 'Malefic'} net = ${netContribution > 0 ? '+' : ''}${netContribution.toFixed(2)} Virupas`
      );
    }
  }

  if (aspectDetails.length === 0) {
    evidence.push(`No significant planetary aspect orbs active: 0.00 Virupas`);
  }

  const rupas = virupasToRupas(totalVirupas);
  evidence.push(`Total Drik Bala: ${totalVirupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`);

  return {
    name: 'Drik Bala',
    virupas: totalVirupas,
    rupas,
    formulaVersion: 'bphs-drik-v1',
    status: 'IMPLEMENTED_UNBENCHMARKED',
    inputs: { planet, planetLongitude, aspectCount: aspectDetails.length, aspectDetails },
    evidence,
  };
}

/**
 * Classical BPHS Continuous Aspect Value Function
 */
function calculateParashariDrushti(aspectingPlanet: PlanetName, angle: number): number {
  let baseDrushti = 0;

  if (angle >= 30 && angle < 60) {
    baseDrushti = (angle - 30) / 2;
  } else if (angle >= 60 && angle < 90) {
    baseDrushti = 15 + ((angle - 60) / 2);
  } else if (angle >= 90 && angle < 120) {
    baseDrushti = 30 + ((angle - 90) / 2);
  } else if (angle >= 120 && angle < 150) {
    baseDrushti = 60 - (angle - 120);
  } else if (angle >= 150 && angle <= 180) {
    baseDrushti = 30 + (angle - 150); // Peak at 180° = 60 Virupas
  } else if (angle > 180 && angle <= 210) {
    baseDrushti = 60 - ((angle - 180) * 2);
  }

  // Special Parashari Aspects
  if (aspectingPlanet === 'Mars') {
    // Mars 4th aspect (90°) and 8th aspect (210°)
    if (Math.abs(angle - 90) <= 15) baseDrushti = Math.max(baseDrushti, 60 - Math.abs(angle - 90) * 2);
    if (Math.abs(angle - 210) <= 15) baseDrushti = Math.max(baseDrushti, 60 - Math.abs(angle - 210) * 2);
  } else if (aspectingPlanet === 'Jupiter') {
    // Jupiter 5th aspect (120°) and 9th aspect (240°)
    if (Math.abs(angle - 120) <= 15) baseDrushti = Math.max(baseDrushti, 60 - Math.abs(angle - 120) * 2);
    if (Math.abs(angle - 240) <= 15) baseDrushti = Math.max(baseDrushti, 60 - Math.abs(angle - 240) * 2);
  } else if (aspectingPlanet === 'Saturn') {
    // Saturn 3rd aspect (60°) and 10th aspect (270°)
    if (Math.abs(angle - 60) <= 15) baseDrushti = Math.max(baseDrushti, 60 - Math.abs(angle - 60) * 2);
    if (Math.abs(angle - 270) <= 15) baseDrushti = Math.max(baseDrushti, 60 - Math.abs(angle - 270) * 2);
  }

  return Math.max(0, Math.min(60, baseDrushti));
}
