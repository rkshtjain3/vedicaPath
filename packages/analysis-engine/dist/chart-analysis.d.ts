import { BirthChart } from '@vedica/astrology-core';
import { AnalysisProfile } from './config/analysis-profile.js';
import { ChartAnalysisResult } from './types/analysis-types.js';
export declare function analyzeChart(chart: BirthChart, profile?: AnalysisProfile): ChartAnalysisResult;
