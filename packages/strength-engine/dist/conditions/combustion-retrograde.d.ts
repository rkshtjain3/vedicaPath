import { PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { StrengthFactor, StrengthProfile } from '../types/strength-types.js';
export declare function evaluateCombustionFactor(planet: PlanetName, analysis: ChartAnalysisResult, profile?: StrengthProfile): StrengthFactor | null;
export declare function evaluateRetrogradeFactor(planet: PlanetName, analysis: ChartAnalysisResult, profile?: StrengthProfile): StrengthFactor;
