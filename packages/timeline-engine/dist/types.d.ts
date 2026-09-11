export type DashaLevel = 'MAHADASHA' | 'ANTARDASHA' | 'PRATYANTARDASHA';
export type EvidenceDirection = 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL';
export type EvidenceStrength = 'LOW' | 'MEDIUM' | 'HIGH';
export type LifeDomain = 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'HEALTH' | 'EDUCATION' | 'PROPERTY' | 'SPIRITUALITY';
export type TimingWindowContextClass = 'HIGH_EVIDENCE_CONTEXT' | 'MODERATE_EVIDENCE_CONTEXT' | 'MIXED_EVIDENCE_CONTEXT' | 'LOW_EVIDENCE_CONTEXT' | 'INSUFFICIENT_EVIDENCE';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export interface TimingEvidence {
    id: string;
    periodId: string;
    domain: LifeDomain;
    planet: string;
    sourceEngine: string;
    sourceRuleId?: string;
    description: string;
    direction: EvidenceDirection;
    strength: EvidenceStrength;
    weight: number;
    whyEvidence: string[];
}
export interface LordChartContext {
    planet: string;
    natalContext: {
        sign?: string;
        house?: number;
        dignity?: string;
        isRetrograde?: boolean;
        isCombust?: boolean;
        ownedHouses?: number[];
    };
    strengthContext: {
        score?: number;
        overallStrength?: string;
        shadbalaVirupas?: number;
        shadbalaRatio?: number;
        isStrong?: boolean;
    };
    yogaContext: Array<{
        id?: string;
        name: string;
        category?: string;
        description?: string;
    }>;
    divisionalContext: {
        d9Sign?: string;
        d9House?: number;
        d10Sign?: string;
        d10House?: number;
        isVargottama?: boolean;
    };
    lifeDomainRelevance: LifeDomain[];
}
export interface TimelinePeriod {
    id: string;
    level: DashaLevel;
    lord: string;
    parentLord?: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    isPast: boolean;
    isCurrent: boolean;
    isFuture: boolean;
    lordContext?: LordChartContext;
    evidence: TimingEvidence[];
    children?: TimelinePeriod[];
}
export interface TransitContextOverlay {
    jupiter: {
        sign?: string;
        houseFromLagna?: number;
        bavPoints?: number;
        bavAverage?: number;
        savPoints?: number;
        savAverage?: number;
        classification?: string;
    };
    saturn: {
        sign?: string;
        houseFromLagna?: number;
        bavPoints?: number;
        bavAverage?: number;
        savPoints?: number;
        savAverage?: number;
        classification?: string;
    };
    ashtakavargaSummary?: string;
}
export interface TimingWindow {
    id: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    contextClass: TimingWindowContextClass;
    domain: LifeDomain;
    activeLords: string[];
    supportScore: number;
    challengeScore: number;
    neutralScore: number;
    evidenceCount: number;
    supportingFactors: TimingEvidence[];
    challengingFactors: TimingEvidence[];
    mixedSignalsPreserved: boolean;
    conflictingPairs?: Array<{
        support: TimingEvidence;
        challenge: TimingEvidence;
    }>;
    transitContext?: TransitContextOverlay;
    whyEvidence: string[];
}
export interface ConfidenceMetadata {
    level: ConfidenceLevel;
    score: number;
    independentEngineCount: number;
    completenessRatio: number;
    benchmarkedStatus: boolean;
    metadataExplanation: string;
}
export interface TimelineAnalysisOutput {
    profileVersion: string;
    targetDate: string;
    currentPeriod: {
        mahadasha?: TimelinePeriod;
        antardasha?: TimelinePeriod;
        pratyantardasha?: TimelinePeriod;
    };
    timeline: TimelinePeriod[];
    timingWindows: TimingWindow[];
    domainContexts: Record<LifeDomain, TimingWindow[]>;
    confidence: ConfidenceMetadata;
    summary: {
        totalPeriodsGenerated: number;
        totalTimingWindows: number;
        evaluatedRuleIds: string[];
    };
    audit: {
        hashKey: string;
        evaluatedAt: string;
        targetDate: string;
    };
}
//# sourceMappingURL=types.d.ts.map