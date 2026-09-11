import { PlanetName } from '@vedica/astrology-core';
import { ConjunctionResultInput, HouseLordFactInput, PlanetFactInput, VedicAspectInput } from '../types/yoga-types.js';
export interface RelationshipResult {
    associated: boolean;
    type?: 'CONJUNCTION' | 'MUTUAL_ASPECT' | 'DIRECT_ASPECT' | 'PARIVARTANA';
    details: string;
}
export declare function evaluatePlanetRelationship(planetA: PlanetName, planetB: PlanetName, houseA: number, houseB: number, planetFacts: PlanetFactInput[], conjunctions: ConjunctionResultInput[], aspects: VedicAspectInput[], houseLordFacts: HouseLordFactInput[]): RelationshipResult;
