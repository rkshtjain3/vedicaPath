import { PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult, PlanetFact } from '@vedica/analysis-engine';
import { DivisionalChart } from '@vedica/divisional-chart-engine';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
export interface SaptavargaContext {
    planet: PlanetName;
    d1Fact: PlanetFact;
    analysis: ChartAnalysisResult;
    d1Chart: any;
    d2Chart?: DivisionalChart;
    d3Chart?: DivisionalChart;
    d7Chart?: DivisionalChart;
    d9Chart?: DivisionalChart;
    d12Chart?: DivisionalChart;
    d30Chart?: DivisionalChart;
}
/**
 * Calculates Saptavargaja Bala using the 7 Vargas: D1, D2, D3, D7, D9, D12, D30.
 * Follows BPHS Panchadha Maitri (5-fold relationship) dignity points:
 * - Moolatrikona: 45 Virupas
 * - Swakshetra (Own House): 30 Virupas
 * - Adhi Mitra (Great Friend): 22.5 Virupas
 * - Mitra (Friend): 15 Virupas
 * - Sama (Neutral): 7.5 Virupas
 * - Shatru (Enemy): 3.75 Virupas
 * - Adhi Shatru (Great Enemy): 1.875 Virupas
 */
export declare function calculateSaptavargajaBala(context: SaptavargaContext): SthanaBalaSubcomponent;
