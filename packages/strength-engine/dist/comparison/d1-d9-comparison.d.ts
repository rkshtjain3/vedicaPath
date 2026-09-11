import { PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DivisionalChart } from '@vedica/divisional-chart-engine';
import { StrengthFactor, StrengthProfile } from '../types/strength-types.js';
export interface D1D9ComparisonResult {
    planet: PlanetName;
    d1Sign: string;
    d9Sign?: string;
    d1House: number;
    d9House?: number;
    isVargottama: boolean;
    vargottamaFactor: StrengthFactor | null;
}
export declare function evaluateD1D9Comparison(planet: PlanetName, analysis: ChartAnalysisResult, d9Chart?: DivisionalChart, profile?: StrengthProfile): D1D9ComparisonResult;
