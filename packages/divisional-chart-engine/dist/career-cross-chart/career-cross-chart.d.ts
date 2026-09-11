import { BirthChart } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { CareerCrossChartAnalysis, DivisionalChart } from '../types/divisional-types.js';
/**
 * Calculates factual career cross-chart relationships between D1 Natal Rashi and D10 Dashamsa charts.
 * Produces machine-readable facts with step-by-step calculation trace evidence ("WHY?" evidence).
 * Does NOT generate predictive statements or generic horoscopes.
 */
export declare function calculateCareerCrossChartFacts(birthChart: BirthChart, d10Chart: DivisionalChart, d1Analysis: ChartAnalysisResult, d9Chart?: DivisionalChart, strengthScores?: Record<string, {
    totalScore: number;
    classification: string;
}>): CareerCrossChartAnalysis;
