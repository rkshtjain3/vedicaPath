import { CombustionResult, PlanetFact } from '../types/analysis-types.js';
export declare function calculateCombustion(planetFacts: PlanetFact[], combustionThresholds: Record<string, {
    direct: number;
    retrograde: number;
}>): CombustionResult[];
