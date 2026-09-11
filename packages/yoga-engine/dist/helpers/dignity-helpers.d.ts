import { PlanetName } from '@vedica/astrology-core';
import { PlanetDignityInput } from '../types/yoga-types.js';
export declare function getPlanetDignity(planet: PlanetName, dignities: PlanetDignityInput[]): PlanetDignityInput | undefined;
export declare function isDignified(dignity?: PlanetDignityInput): boolean;
export declare function isExalted(dignity?: PlanetDignityInput): boolean;
export declare function isDebilitated(dignity?: PlanetDignityInput): boolean;
