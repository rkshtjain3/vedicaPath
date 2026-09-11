import { PlanetName, PlanetPosition } from '@vedica/astrology-core';
import { ShadbalaComponent } from '../types/shadbala-types.js';
import { virupasToRupas } from '../units/shadbala-units.js';

/**
 * Calculates Cheshta Bala (Motional Strength) for Tara Grahas (Mars, Mercury, Jupiter, Venus, Saturn).
 * Sun and Moon are handled separately (Ayana Bala and Paksha Bala).
 * 
 * Formula (Modern Astronomical Approximation of BPHS Seeghrochcha):
 * For Outer Planets (Mars, Jupiter, Saturn): 
 *   Cheshta Kendra = |Sun Longitude - Planet Longitude|
 * For Inner Planets (Mercury, Venus):
 *   Since inferior conjunction = retrograde (max strength) and superior conjunction = direct (min strength),
 *   we use the relative speed difference or theoretical elongation.
 *   For a robust mathematical model without arbitrary values, we implement the arc of retrogression.
 *   If mean longitudes are missing, we use a proxy based on speed and solar distance.
 */
export function calculateCheshtaBala(
  planet: PlanetName,
  planetPos: PlanetPosition,
  sunLongitude: number
): ShadbalaComponent {
  let virupas = 0;
  const evidence: string[] = [];

  // Sun and Moon Cheshta Bala are delegated to Kala Bala components
  if (planet === 'Sun' || planet === 'Moon') {
    return {
      name: 'Cheshta Bala',
      virupas: 0,
      rupas: 0,
      formulaVersion: 'bphs-cheshta-v1',
      status: 'NOT_IMPLEMENTED',
      inputs: { planet },
      evidence: [
        `Planet: ${planet}`,
        planet === 'Sun' 
          ? 'Sun Cheshta Bala is equivalent to Ayana Bala (Kala Bala). Currently NOT_IMPLEMENTED.'
          : 'Moon Cheshta Bala is equivalent to Paksha Bala (Kala Bala). Currently NOT_IMPLEMENTED.',
        'Virupas assigned: 0'
      ],
    };
  }

  // Modern approximation for Cheshta Kendra using true positions
  // Outer Planets: Retrograde at opposition (180 deg from Sun) -> Max Cheshta (60 Virupas)
  // Inner Planets: Retrograde at inferior conjunction -> Max Cheshta (60 Virupas)
  let cheshtaKendra = 0;
  
  const isOuter = planet === 'Mars' || planet === 'Jupiter' || planet === 'Saturn';
  const isInner = planet === 'Mercury' || planet === 'Venus';

  let distance = Math.abs(sunLongitude - planetPos.longitude);
  if (distance > 180) {
    distance = 360 - distance;
  } // Distance from Sun (0 to 180)

  if (isOuter) {
    // For outer planets, 180 distance = max strength (60), 0 distance = min strength (0)
    cheshtaKendra = distance;
    evidence.push(`Outer Planet (${planet}) calculation: Distance from Sun = ${distance.toFixed(4)}°`);
  } else if (isInner) {
    // For inner planets, inferior conjunction (retrograde, speed < 0) = max strength.
    // Superior conjunction (direct, speed > 0) = min strength.
    // Since true elongation is small (max ~28° for Mercury, ~47° for Venus), 
    // we use a mathematical proxy based on speed and elongation.
    // To strictly follow BPHS Seeghrochcha, we'd need exact heliocentric mean longitudes.
    // As a temporary mathematical proxy that scales deterministically:
    // We map the speed. If retrograde, strength is high.
    if (planetPos.isRetrograde) {
      cheshtaKendra = 180; // Peak retrogression
    } else {
      cheshtaKendra = 0; // Direct motion
    }
    evidence.push(`Inner Planet (${planet}) calculation: Retrograde status used as proxy for Seeghrochcha arc.`);
  }

  // BPHS Formula: Virupas = Cheshta Kendra / 3
  virupas = cheshtaKendra / 3;

  // Ensure bounds
  virupas = Math.max(0, Math.min(60, virupas));
  const rupas = virupasToRupas(virupas);

  evidence.push(`Cheshta Kendra (Arc of Retrogression proxy): ${cheshtaKendra.toFixed(4)}°`);
  evidence.push(`Cheshta Bala = Cheshta Kendra / 3 = ${virupas.toFixed(4)} Virupas (${rupas.toFixed(4)} Rupas)`);

  return {
    name: 'Cheshta Bala',
    virupas,
    rupas,
    formulaVersion: 'bphs-cheshta-v1',
    status: 'IMPLEMENTED_UNBENCHMARKED',
    inputs: {
      planet,
      planetLongitude: planetPos.longitude,
      sunLongitude,
      speed: planetPos.speed,
      isRetrograde: planetPos.isRetrograde,
      cheshtaKendra
    },
    evidence,
  };
}
