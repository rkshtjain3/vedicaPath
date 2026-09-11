import { PlanetName } from '@vedica/astrology-core';
import { HouseFact, PlanetFact } from '../types/analysis-types.js';
export declare const SIGN_NAMES: string[];
export declare const SIGN_LORDS: Record<string, PlanetName>;
export declare function calculateHouseFacts(lagnaSignIndex: number, planetFacts: PlanetFact[]): HouseFact[];
