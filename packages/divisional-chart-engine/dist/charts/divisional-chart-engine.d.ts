import { BirthChart } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DivisionalChart, DivisionalChartAnalysis, DivisionalChartProfile, DivisionalChartType, VargaComparisonResult, VargaDashamsaComparisonResult } from '../types/divisional-types.js';
export declare const DIVISIONAL_PROFILES: Record<DivisionalChartType, DivisionalChartProfile>;
/**
 * Calculates a Divisional Chart from already calculated sidereal D1 planetary longitudes.
 * Reuses D1 sidereal longitudes without re-querying ephemeris.
 */
export declare function calculateDivisionalChart(birthChart: BirthChart, type?: DivisionalChartType): DivisionalChart;
/**
 * Calculates all 16 Shodashavarga Divisional Charts in a single efficient pass.
 */
export declare function calculateAllDivisionalCharts(birthChart: BirthChart): Record<DivisionalChartType, DivisionalChart>;
/**
 * Analyzes a Divisional Chart by evaluating planetary dignities, house placements, and occupants.
 */
export declare function analyzeDivisionalChart(divChart: DivisionalChart, d1Analysis?: ChartAnalysisResult): DivisionalChartAnalysis;
/**
 * Performs machine-readable factual comparison between D1 Rashi and D9 Navamsa.
 * Detects Ascendant & Planetary Vargottama status (D1 Sign === D9 Sign).
 */
export declare function compareRashiAndNavamsa(birthChart: BirthChart, d9Chart: DivisionalChart, d1Analysis?: ChartAnalysisResult): VargaComparisonResult;
/**
 * Performs machine-readable factual comparison between D1 Rashi and D10 Dashamsa.
 */
export declare function compareRashiAndDashamsa(birthChart: BirthChart, d10Chart: DivisionalChart, d1Analysis?: ChartAnalysisResult): VargaDashamsaComparisonResult;
