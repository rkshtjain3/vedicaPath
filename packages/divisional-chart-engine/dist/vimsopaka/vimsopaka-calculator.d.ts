import { BirthChart } from '@vedica/astrology-core';
import { DivisionalChart, DivisionalChartType, VimsopakaBalaReport, VimsopakaScheme } from '../types/divisional-types.js';
export declare const SHODASHAVARGA_WEIGHTS: Record<DivisionalChartType, number>;
export declare const SHADVARGA_WEIGHTS: Partial<Record<DivisionalChartType, number>>;
export declare const SAPTAVARGA_WEIGHTS: Partial<Record<DivisionalChartType, number>>;
export declare const DASAVARGA_WEIGHTS: Partial<Record<DivisionalChartType, number>>;
/**
 * Calculates Vimsopaka Bala (20-point divisional strength) for the 7 classical planets.
 * Supports Shodashavarga (16 vargas), Dasavarga (10), Saptavarga (7), and Shadvarga (6).
 */
export declare function calculateVimsopakaBala(birthChart: BirthChart, divisionalCharts: Record<DivisionalChartType, DivisionalChart>, scheme?: VimsopakaScheme): VimsopakaBalaReport;
