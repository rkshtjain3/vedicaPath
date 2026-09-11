import { PlanetName } from '@vedica/astrology-core';
import { RuleDomain, RuleEvaluation } from '@vedica/rules-engine';
import { TimingDomain, TransitEvaluation, MultiLevelDashaActivation } from '@vedica/timing-engine';

export type InterpretationDomain = RuleDomain | TimingDomain;

export type FactorClassification = 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL';
export type FactorType = 'RULE' | 'TIMING' | 'DASHA' | 'TRANSIT';

export interface InterpretationFactor {
  id: string;
  type: FactorType;
  sourceId: string;
  title: string;
  description: string;
  classification: FactorClassification;
  weight?: number;
  evidence: any[];
}

export interface MixedSignalsResult {
  mixedSignals: boolean;
  supportiveCount: number;
  challengingCount: number;
  neutralCount: number;
  totalFactors: number;
}

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ConfidenceAssessment {
  level: ConfidenceLevel;
  score: number;
  rationale: string[];
  disclaimer: string;
}

export interface SourceMapping {
  text: string;
  sources: string[];
}

export interface DomainInterpretation {
  domain: InterpretationDomain;
  overallActivity: 'LOW' | 'MODERATE' | 'HIGH';
  summary: string;
  supportiveFactors: InterpretationFactor[];
  challengingFactors: InterpretationFactor[];
  neutralFactors: InterpretationFactor[];
  activeTimingFactors: InterpretationFactor[];
  mixedSignals: MixedSignalsResult;
  confidence: ConfidenceAssessment;
  sources: string[];
  explanations: SourceMapping[];
  dashaEvidence?: MultiLevelDashaActivation;
  transitEvidence?: TransitEvaluation[];
  ruleEvaluations?: RuleEvaluation[];
  d10Evidence?: any;
}

export interface InterpretationProfile {
  version: string;
  language: string;
  tone: 'NEUTRAL' | 'DIRECT';
  certaintyPolicy: 'NON_DETERMINISTIC';
  templateSet: string;
}

export interface InterpretationEngineResult {
  calculationProfileVersion: string;
  analysisProfileVersion: string;
  rulesProfileVersion: string;
  timingProfileVersion: string;
  interpretationProfileVersion: string;
  domains: Record<InterpretationDomain, DomainInterpretation>;
}
