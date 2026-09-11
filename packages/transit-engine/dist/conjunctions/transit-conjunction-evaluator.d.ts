import { PlanetName } from '@vedica/astrology-core';
import { TransitConjunction, TransitPosition } from '../types.js';
export declare function calculateCircularAngularDistance(deg1: number, deg2: number): number;
export declare function evaluateTransitConjunctions(transits: TransitPosition[], natalPlanets: {
    planet: PlanetName;
    longitude: number;
}[], toleranceDegrees?: number): TransitConjunction[];
