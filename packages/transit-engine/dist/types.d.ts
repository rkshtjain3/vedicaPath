import { PlanetName, RashiDetails } from '@vedica/astrology-core';
export type LifeDomain = 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'HEALTH' | 'EDUCATION' | 'PROPERTY' | 'SPIRITUALITY';
export type TransitContextClassification = 'SUPPORTIVE_CONTEXT' | 'NEUTRAL_CONTEXT' | 'CHALLENGING_CONTEXT';
export type TransitSamplingProfile = 'CURRENT_ONLY' | 'PERIOD_BOUNDARIES' | 'START_MID_END';
export interface TransitCalculationConfiguration {
    zodiac: 'SIDEREAL';
    ayanamsha: string;
    nodeType: 'MEAN' | 'TRUE';
    ephemerisVersion: string;
    profileVersion: string;
    conjunctionToleranceDegrees: number;
}
export interface TransitPosition {
    planet: PlanetName;
    longitude: number;
    sign: RashiDetails;
    degreeInSign: number;
    formattedDegree: string;
    nakshatra: {
        name: string;
        pada: number;
        ruler: string;
    };
    isRetrograde: boolean;
    speed: number;
    houseFromLagna: number;
    houseFromMoon: number;
    houseFromSun: number;
    calculationTimestamp: string;
}
export interface TransitAspect {
    transitingPlanet: PlanetName;
    natalTarget: PlanetName | 'Lagna';
    targetLongitude: number;
    aspectHouseDistance: number;
    aspectType: string;
    detected: boolean;
    whyEvidence: string[];
}
export interface TransitConjunction {
    transitingPlanet: PlanetName;
    natalPlanet: PlanetName;
    angularDistance: number;
    tolerance: number;
    detected: boolean;
    whyEvidence: string[];
}
export interface TransitHouseContext {
    planet: PlanetName;
    houseFromLagna: number;
    houseFromMoon: number;
    classification: TransitContextClassification;
    explanation: string;
    whyEvidence: string[];
}
export interface TransitRetrogradeContext {
    planet: PlanetName;
    motionState: 'DIRECT' | 'RETROGRADE';
    speed: number;
    explanation: string;
    whyEvidence: string[];
}
export interface TransitEvidence {
    id: string;
    planet: PlanetName;
    domain: LifeDomain;
    direction: 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL';
    weight: number;
    sourceRuleId: string;
    description: string;
    whyEvidence: string[];
}
export interface DomainTransitEvidence {
    domain: LifeDomain;
    evidence: TransitEvidence[];
    supportiveCount: number;
    challengingCount: number;
    neutralCount: number;
    disclaimer?: string;
}
export interface ConvergenceEvidenceItem {
    sourceEngine: 'NATAL' | 'LIFE_DOMAIN' | 'DASHA' | 'TRANSIT' | 'ASHTAKAVARGA' | 'YOGA' | 'STRENGTH';
    evidenceId: string;
    description: string;
    direction: 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL';
    weight: number;
}
export interface DomainConvergenceResult {
    domain: LifeDomain;
    natalEvidenceCount: number;
    dashaEvidenceCount: number;
    transitEvidenceCount: number;
    ashtakavargaEvidenceCount: number;
    supportiveEvidence: ConvergenceEvidenceItem[];
    challengingEvidence: ConvergenceEvidenceItem[];
    mixedSignals: boolean;
    convergenceLevel: 'HIGH_CONVERGENCE' | 'MODERATE_CONVERGENCE' | 'MIXED_SIGNALS' | 'LIMITED_EVIDENCE';
    whyEvidence: string[];
    disclaimer?: string;
}
export interface TransitAnalysisOutput {
    profileVersion: string;
    calculationDate: string;
    configuration: TransitCalculationConfiguration;
    planets: TransitPosition[];
    aspects: TransitAspect[];
    conjunctions: TransitConjunction[];
    houseContexts: TransitHouseContext[];
    retrogradeContexts: TransitRetrogradeContext[];
    domainEvidence: Record<LifeDomain, DomainTransitEvidence>;
    reproducibilityHash: string;
}
export interface NatalDashaTransitConvergenceOutput {
    profileVersion: string;
    calculatedAt: string;
    activeDashaContext: {
        mahadasha?: string;
        antardasha?: string;
        pratyantardasha?: string;
    };
    domainConvergence: Record<LifeDomain, DomainConvergenceResult>;
    convergenceSummary: {
        totalEnginesEvaluated: number;
        highConvergenceDomains: LifeDomain[];
        mixedSignalDomains: LifeDomain[];
    };
    reproducibilityHash: string;
}
