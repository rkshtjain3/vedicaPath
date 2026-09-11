import { BirthChart, PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DivisionalChart } from '@vedica/divisional-chart-engine';
import { PlanetStrengthAnalysis, RelationshipMatrix, StrengthAnalysisResult, StrengthProfile } from '../types/strength-types.js';
export declare function calculateSinglePlanetStrength(planet: PlanetName, chart: BirthChart, analysis: ChartAnalysisResult, relationships: RelationshipMatrix, d9Chart?: DivisionalChart, profile?: StrengthProfile): PlanetStrengthAnalysis;
export declare function evaluateStrengthEngine(chart: BirthChart, analysis: ChartAnalysisResult, d9Chart?: DivisionalChart, profile?: StrengthProfile): StrengthAnalysisResult;
