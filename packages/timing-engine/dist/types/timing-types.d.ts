import { PlanetName } from '@vedica/astrology-core';
import { RuleEffect, RuleEvidence } from '@vedica/rules-engine';
export type ZodiacSign = string;
export type TimingDomain = 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'PROPERTY';
export type ActivityRating = 'LOW' | 'MODERATE' | 'HIGH';
export interface DashaLevelActivation {
    dashaLevel: 'MAHADASHA' | 'ANTARDASHA' | 'PRATYANTARDASHA';
    lord: PlanetName;
    connected: boolean;
    score: number;
    evidence: RuleEvidence[];
}
export interface MultiLevelDashaActivation {
    domain: TimingDomain;
    mahadasha: DashaLevelActivation;
    antardasha: DashaLevelActivation;
    pratyantardasha: DashaLevelActivation;
    totalScore: number;
}
export interface TransitPosition {
    planet: PlanetName;
    longitude: number;
    signIndex: number;
    signName: ZodiacSign;
    degreeInSign: number;
    isRetrograde: boolean;
    natalHouse: number;
}
export interface TransitRuleEvidence {
    transitPlanet: PlanetName;
    transitSign: ZodiacSign;
    natalHouse: number;
    details: string;
}
export interface TransitEvaluation {
    ruleId: string;
    domain: TimingDomain;
    triggered: boolean;
    effects: RuleEffect[];
    evidence: TransitRuleEvidence;
    explanationKey: string;
}
export interface DomainTimelinePeriod {
    start: string;
    end: string;
    activity: ActivityRating;
    dashaActivation: MultiLevelDashaActivation;
    transitEvaluations: TransitEvaluation[];
    factors: string[];
}
export interface CombinedActivityWindow {
    start: string;
    end: string;
    activity: ActivityRating;
    natalStrength: ActivityRating;
    dashaActivationRating: ActivityRating;
    transitActivationRating: ActivityRating;
    totalScore: number;
    factors: string[];
    dashaEvidence: MultiLevelDashaActivation;
    transitEvidence: TransitEvaluation[];
}
export interface TimingEngineResult {
    calculationProfileVersion: string;
    analysisProfileVersion: string;
    rulesProfileVersion: string;
    timingProfileVersion: string;
    currentStatus: Record<TimingDomain, {
        dashaActivation: MultiLevelDashaActivation;
        transitEvaluations: TransitEvaluation[];
        combinedActivity: ActivityRating;
        factors: string[];
    }>;
    timelines: Record<TimingDomain, CombinedActivityWindow[]>;
}
//# sourceMappingURL=timing-types.d.ts.map