import { PlanetName } from '@vedica/astrology-core';
import { PlanetFactInput, VedicAspectInput } from '../types/yoga-types.js';
export declare function planetAspectsHouse(planet: PlanetName, targetHouse: number, aspects: VedicAspectInput[]): boolean;
export declare function planetAspectsPlanet(fromPlanet: PlanetName, toPlanet: PlanetName, planetFacts: PlanetFactInput[], aspects: VedicAspectInput[]): boolean;
export declare function areMutualAspecting(planetA: PlanetName, planetB: PlanetName, planetFacts: PlanetFactInput[], aspects: VedicAspectInput[]): boolean;
