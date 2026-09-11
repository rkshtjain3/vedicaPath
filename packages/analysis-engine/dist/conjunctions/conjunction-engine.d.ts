import { ConjunctionResult, PlanetFact } from '../types/analysis-types.js';
export declare function calculateAngularDistance(lonA: number, lonB: number): number;
export declare function detectConjunctions(planetFacts: PlanetFact[], orbDegrees?: number): ConjunctionResult[];
