import { PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { StrengthFactor, StrengthProfile } from '../types/strength-types.js';
import { CompoundRelationshipResult } from '../types/strength-types.js';
export declare function evaluateDignityStrength(planet: PlanetName, analysis: ChartAnalysisResult, signLordRelationship?: CompoundRelationshipResult, profile?: StrengthProfile): {
    dignityName: string;
    factor: StrengthFactor;
};
