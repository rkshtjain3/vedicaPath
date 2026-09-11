export type LifeDomain =
  | 'CAREER'
  | 'WEALTH'
  | 'RELATIONSHIPS'
  | 'HEALTH'
  | 'EDUCATION'
  | 'PROPERTY'
  | 'SPIRITUALITY';

export type EvidenceDirection = 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL';

export type EvidenceStrength = 'LOW' | 'MEDIUM' | 'HIGH';

export type DomainState =
  | 'STRONGLY_SUPPORTIVE'
  | 'SUPPORTIVE'
  | 'MIXED'
  | 'CHALLENGING'
  | 'STRONGLY_CHALLENGING'
  | 'INSUFFICIENT_EVIDENCE';

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DomainEvidenceItem {
  id: string;
  domain: LifeDomain;
  sourceEngine: string;
  sourceRuleId?: string;
  description: string;
  direction: EvidenceDirection;
  strength: EvidenceStrength;
  weight: number;
  whyEvidence: string[];
}

export interface DomainScoringResult {
  supportScore: number;
  challengeScore: number;
  neutralScore: number;
  state: DomainState;
  hasMixedSignals: boolean;
  supportCount: number;
  challengeCount: number;
  neutralCount: number;
}

export interface ConfidenceMetadata {
  level: ConfidenceLevel;
  evidenceSourceCount: number;
  engineDiversityCount: number;
  dataCompletenessScore: number;
  disclaimer: string;
}

export interface DashaContextItem {
  periodType: 'PAST' | 'CURRENT_MAHADASHA' | 'CURRENT_ANTARDASHA' | 'NEXT_ANTARDASHA';
  mahadashaLord: string;
  antardashaLord?: string;
  startDate?: string;
  endDate?: string;
  natalHousePlacement?: number;
  dignity?: string;
  strengthScore?: number;
  domainRelevance: string;
  nonPredictiveExplanation: string;
}

export interface TransitContextItem {
  planet: 'Jupiter' | 'Saturn';
  currentSign: string;
  transitedHouseFromLagna: number;
  transitedHouseFromMoon: number;
  bavPoints: number;
  savPoints: number;
  classification: 'SUPPORTIVE' | 'NEUTRAL' | 'CHALLENGING';
  nonPredictiveExplanation: string;
}

export interface DomainEvaluationResult {
  domain: LifeDomain;
  title: string;
  summary: string;
  state: DomainState;
  scoring: DomainScoringResult;
  confidence: ConfidenceMetadata;
  supportingFactors: DomainEvidenceItem[];
  challengingFactors: DomainEvidenceItem[];
  neutralFactors: DomainEvidenceItem[];
  mixedSignals: {
    present: boolean;
    description: string;
    conflictingPairs: Array<{
      support: DomainEvidenceItem;
      challenge: DomainEvidenceItem;
    }>;
  };
  relevantPlanetaryIndicators: Array<{
    planet: string;
    role: string;
    sign: string;
    house: number;
    dignity: string;
    strengthScore: number;
    shadbalaRatio?: number;
  }>;
  relevantHouses: Array<{
    house: number;
    sign: string;
    lord: string;
    lordDignity: string;
    occupants: string[];
  }>;
  relevantYogas: Array<{
    name: string;
    category: string;
    relevance: string;
  }>;
  divisionalEvidence: Array<{
    chartType: 'D9' | 'D10';
    indicator: string;
    placement: string;
    finding: string;
  }>;
  dashaContext: DashaContextItem[];
  transitContext: TransitContextItem[];
  whyEvidence: string[];
  disclaimer?: string;
}

export interface LifeDomainAnalysisOutput {
  profileVersion: string;
  evaluatedAt: string;
  evaluatedRuleIds: string[];
  domains: Record<LifeDomain, DomainEvaluationResult>;
  summary: {
    totalEnginesEvaluated: number;
    totalEvidenceItems: number;
    mixedDomainCount: number;
    dominantDomain: LifeDomain;
  };
  audit: {
    hashKey: string;
  };
}
