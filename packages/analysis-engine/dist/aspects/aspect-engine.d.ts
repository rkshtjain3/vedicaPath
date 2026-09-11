import { PlanetFact, VedicAspect } from '../types/analysis-types.js';
export declare const SPECIAL_ASPECTS: Record<string, number[]>;
export declare function calculateTargetHouse(fromHouse: number, aspectNumber: number): number;
export declare function calculateVedicAspects(planetFacts: PlanetFact[], includeNodeAspects?: boolean): VedicAspect[];
