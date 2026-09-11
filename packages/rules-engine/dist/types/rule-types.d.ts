import { BirthChart, PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DashaPeriod, CurrentDashaResult } from '@vedica/dasha-engine';
import { DivisionalChart, CareerCrossChartAnalysis } from '@vedica/divisional-chart-engine';
export type RuleDomain = 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'PROPERTY';
export interface CurrentDashaContext {
    mahadasha?: DashaPeriod;
    antardasha?: DashaPeriod;
    pratyantardasha?: DashaPeriod;
}
export interface AstrologyRuleContext {
    chart: BirthChart;
    dasha?: any;
    currentDasha: CurrentDashaContext | CurrentDashaResult;
    analysis: ChartAnalysisResult;
    d10Chart?: DivisionalChart;
    d9Chart?: DivisionalChart;
    d10Analysis?: any;
    careerCrossChart?: CareerCrossChartAnalysis;
}
export interface RuleEffect {
    dimension: string;
    value: number;
}
export interface RuleEvidence {
    type: string;
    planet?: PlanetName;
    house?: number;
    lord?: PlanetName;
    dignity?: string;
    details?: string;
    effectClassification?: 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING';
    [key: string]: any;
}
export interface RuleEvaluation {
    ruleId: string;
    domain: RuleDomain | 'CAREER_D10';
    triggered: boolean;
    effects: RuleEffect[];
    evidence: RuleEvidence[];
    explanationKey: string;
}
export interface AstrologyRule {
    id: string;
    domain: RuleDomain | 'CAREER_D10';
    version: string;
    evaluate(context: AstrologyRuleContext): RuleEvaluation;
}
export type RatingLevel = 'LOW' | 'MODERATE' | 'HIGH';
export interface DomainAnalysisResult {
    domain: RuleDomain;
    dimensionScores: Record<string, number>;
    dimensionRatings: Record<string, RatingLevel>;
    evaluations: RuleEvaluation[];
    triggeredRuleIds: string[];
}
export interface CareerD10SummaryFacts {
    d10LagnaSign: string;
    d10LagnaLord: string;
    d10TenthSign: string;
    d10TenthLord: string;
    d1TenthLord: string;
    sameTenthLord: boolean;
    d10TenthLordHouse: number;
    d10TenthLordDignity: string;
    d10TenthLordHouseCategory: string;
    d10LagnaLordHouse: number;
    d10LagnaLordDignity: string;
    d10LagnaLordHouseCategory: string;
    karakas: Array<{
        planet: string;
        d10House: number;
        sign: string;
        dignity: string;
        houseCategory: string;
    }>;
}
export interface CareerD10Analysis {
    profileVersion: string;
    rules: RuleEvaluation[];
    supportiveEvidence: RuleEvidence[];
    challengingEvidence: RuleEvidence[];
    neutralEvidence: RuleEvidence[];
    mixedSignals: boolean;
    summaryFacts: CareerD10SummaryFacts;
}
export interface RulesEngineResult {
    rulesProfileVersion: string;
    calculationProfileVersion: string;
    analysisProfileVersion: string;
    domains: Record<RuleDomain, DomainAnalysisResult>;
    careerD10?: CareerD10Analysis;
}
//# sourceMappingURL=rule-types.d.ts.map