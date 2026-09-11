import { BirthChart, PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DivisionalChart } from '@vedica/divisional-chart-engine';
import { ShadbalaEngineResult, ShadbalaProfile } from './types/shadbala-types.js';
export declare const SEVEN_PLANETS: PlanetName[];
export interface ShadbalaContext {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    d2Chart?: DivisionalChart;
    d3Chart?: DivisionalChart;
    d7Chart?: DivisionalChart;
    d9Chart?: DivisionalChart;
    d12Chart?: DivisionalChart;
    d30Chart?: DivisionalChart;
}
export declare function evaluateShadbalaEngine(context: ShadbalaContext, profile?: ShadbalaProfile): ShadbalaEngineResult;
