import { PlanetName, RashiDetails } from '@vedica/astrology-core';
import { SthanaBalaComponent, SthanaBalaSubcomponent } from '../types/shadbala-types.js';
export declare function calculateSthanaBala(planet: PlanetName, longitude: number, degreeInSign: number, house: number, d1Sign: RashiDetails, d9Sign: RashiDetails | undefined, saptavarga: SthanaBalaSubcomponent): SthanaBalaComponent;
