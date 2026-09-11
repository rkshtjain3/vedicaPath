import { PlanetName } from '@vedica/astrology-core';
import { HouseLordFactInput, PlanetFactInput } from '../types/yoga-types.js';
export declare function getLordOfHouse(houseNumber: number, houseLordFacts: HouseLordFactInput[]): PlanetName | undefined;
export declare function getHouseLordFact(houseNumber: number, houseLordFacts: HouseLordFactInput[]): HouseLordFactInput | undefined;
export declare function getPlanetFact(planet: PlanetName, planetFacts: PlanetFactInput[]): PlanetFactInput | undefined;
export declare function isParivartana(houseA: number, houseB: number, houseLordFacts: HouseLordFactInput[]): boolean;
