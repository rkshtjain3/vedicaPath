import { PlanetName } from '@vedica/astrology-core';
import { ConjunctionResultInput, PlanetFactInput } from '../types/yoga-types.js';
export declare function areConjunct(planetA: PlanetName, planetB: PlanetName, planetFacts: PlanetFactInput[], conjunctions: ConjunctionResultInput[]): {
    conjunct: boolean;
    details: string;
};
