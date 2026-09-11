import { PlanetName } from '@vedica/astrology-core';
import { LordRelationship, PlanetDignity, PlanetFact } from '../types/analysis-types.js';
export declare const EXALTATION: Record<string, {
    sign: string;
    degree: number;
}>;
export declare const DEBILITATION: Record<string, {
    sign: string;
    degree: number;
}>;
export declare const MOOLATRIKONA: Record<string, {
    sign: string;
    maxDegree: number;
}>;
export declare const OWN_SIGNS: Record<string, string[]>;
export declare const NAISARGIKA_FRIENDSHIPS: Record<string, {
    friends: PlanetName[];
    neutral: PlanetName[];
    enemies: PlanetName[];
}>;
export declare function getLordRelationship(planet: PlanetName, signLord: PlanetName): LordRelationship;
export declare function calculatePlanetDignity(p: PlanetFact): PlanetDignity;
export declare function calculateAllDignities(planetFacts: PlanetFact[]): PlanetDignity[];
