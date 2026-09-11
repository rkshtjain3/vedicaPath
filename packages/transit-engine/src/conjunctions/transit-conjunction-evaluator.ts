import { PlanetName } from '@vedica/astrology-core';
import { TransitConjunction, TransitPosition } from '../types.js';

export function calculateCircularAngularDistance(deg1: number, deg2: number): number {
  const diff = Math.abs((deg1 % 360) - (deg2 % 360));
  return Math.min(diff, 360 - diff);
}

export function evaluateTransitConjunctions(
  transits: TransitPosition[],
  natalPlanets: { planet: PlanetName; longitude: number }[],
  toleranceDegrees: number = 6.0
): TransitConjunction[] {
  const conjunctions: TransitConjunction[] = [];

  for (const tr of transits) {
    for (const natal of natalPlanets) {
      const distance = calculateCircularAngularDistance(tr.longitude, natal.longitude);
      const isDetected = distance <= toleranceDegrees;

      if (isDetected) {
        conjunctions.push({
          transitingPlanet: tr.planet,
          natalPlanet: natal.planet,
          angularDistance: parseFloat(distance.toFixed(2)),
          tolerance: toleranceDegrees,
          detected: true,
          whyEvidence: [
            `Transiting ${tr.planet} (${tr.longitude.toFixed(2)}°) is conjunct natal ${natal.planet} (${natal.longitude.toFixed(2)}°).`,
            `Angular distance: ${distance.toFixed(2)}° (configured tolerance: <= ${toleranceDegrees}°).`,
          ],
        });
      }
    }
  }

  return conjunctions;
}
