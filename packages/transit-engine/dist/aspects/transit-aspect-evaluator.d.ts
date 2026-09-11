import { PlanetName } from '@vedica/astrology-core';
import { TransitAspect, TransitPosition } from '../types.js';
export declare function evaluateTransitAspects(transits: TransitPosition[], natalPlanets: {
    planet: PlanetName;
    longitude: number;
}[], natalLagnaLongitude: number): TransitAspect[];
