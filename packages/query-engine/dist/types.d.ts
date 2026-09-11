export type LifeDomain = 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'HEALTH' | 'EDUCATION' | 'PROPERTY' | 'SPIRITUALITY';
export type PlanetName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export type QueryIntentCategory = 'DOMAIN' | 'PLANET' | 'TIMING' | 'YOGA' | 'STRENGTH' | 'TRANSIT' | 'NUMEROLOGY' | 'EVIDENCE' | 'COMPARISON' | 'UNKNOWN';
export type DirectionFilter = 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL' | 'FACTUAL' | 'MIXED' | 'ALL';
export type SourceEngineId = 'ASTROLOGY_CORE' | 'DIVISIONAL_CHART' | 'DASHA' | 'TIMELINE' | 'TRANSIT' | 'ASHTAKAVARGA' | 'STRENGTH' | 'SHADBALA' | 'YOGA' | 'LIFE_DOMAIN' | 'NUMEROLOGY' | 'RULES_ENGINE';
export interface QueryParserEvidence {
    matchedTerm: string;
    mappedEntity: string;
    entityType: 'DOMAIN' | 'PLANET' | 'TIMING' | 'YOGA' | 'STRENGTH' | 'TRANSIT' | 'NUMEROLOGY' | 'FILTER';
}
export interface QueryIntent {
    category: QueryIntentCategory;
    domain?: LifeDomain;
    planet?: PlanetName;
    directionFilter?: DirectionFilter;
    sourceEngineFilter?: SourceEngineId;
    requestedEvidenceTypes?: string[];
    isPredictiveQuery?: boolean;
    requiresNameForNumerology?: boolean;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    parserEvidence: QueryParserEvidence[];
}
export interface QueryEvidenceItem {
    id: string;
    sourceEngine: SourceEngineId;
    sourceRuleId?: string;
    category: string;
    domain?: LifeDomain;
    planet?: PlanetName;
    direction: 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL' | 'FACTUAL';
    title: string;
    description: string;
    weight?: number;
    sourceReference?: string;
    whyEvidence: string[];
}
export interface EvidenceGroup {
    title: string;
    engineId: SourceEngineId;
    evidence: QueryEvidenceItem[];
}
export interface MixedSignalResult {
    detected: boolean;
    supportiveSources: string[];
    challengingSources: string[];
    explanation: string;
}
export type QueryAnswerStatus = 'ANSWERED' | 'INSUFFICIENT_EVIDENCE' | 'UNKNOWN_QUERY' | 'NAME_REQUIRED';
export interface QueryAnswer {
    question: string;
    normalizedQuestion: string;
    intent: QueryIntent;
    status: QueryAnswerStatus;
    summary: string;
    isPredictiveAttempt: boolean;
    predictiveDisclaimer?: string;
    evidenceGroups: EvidenceGroup[];
    supportiveEvidence: QueryEvidenceItem[];
    challengingEvidence: QueryEvidenceItem[];
    neutralEvidence: QueryEvidenceItem[];
    mixedSignals: MixedSignalResult;
    limitations: string[];
    whyEvidence: string[];
}
export interface QueryResultAudit {
    profileVersion: string;
    queryFingerprint: string;
    calculationReproducibilityHash?: string;
}
export interface QueryEngineResponse {
    query: QueryAnswer;
    audit: QueryResultAudit;
}
