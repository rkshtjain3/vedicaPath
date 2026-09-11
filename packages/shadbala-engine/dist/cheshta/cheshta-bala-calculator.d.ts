import { PlanetName, PlanetPosition } from '@vedica/astrology-core';
import { ShadbalaComponent } from '../types/shadbala-types.js';
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
export declare function calculateCheshtaBala(planet: PlanetName, planetPos: PlanetPosition, sunLongitude: number): ShadbalaComponent;
