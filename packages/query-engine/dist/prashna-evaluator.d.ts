import { PrashnaChartResult } from '@vedica/astrology-core';
export interface PrashnaEvaluationResult {
    question: string;
    queryCategory: 'CAREER' | 'RELATIONSHIPS' | 'FINANCE' | 'HEALTH' | 'GENERAL';
    lagnaLord: string;
    karyaLord: string;
    karyaHouse: number;
    hasIthasalaYoga: boolean;
    outcome: 'FAVORABLE' | 'MODERATE' | 'UNFAVORABLE';
    fulfillmentConfidencePercentage: number;
    explanation: string;
}
export declare function evaluatePrashnaQuery(prashna: PrashnaChartResult): PrashnaEvaluationResult;
