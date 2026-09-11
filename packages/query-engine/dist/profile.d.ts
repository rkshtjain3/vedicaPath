import { LifeDomain, PlanetName } from './types.js';
export interface QueryProfile {
    version: string;
    maxEvidenceItemsPerAnswer: number;
    domainKeywords: Record<LifeDomain, string[]>;
    planetAliases: Record<PlanetName, string[]>;
    timingKeywords: string[];
    yogaKeywords: string[];
    strengthKeywords: string[];
    transitKeywords: string[];
    numerologyKeywords: string[];
    predictiveKeywords: string[];
    filterKeywords: {
        supportive: string[];
        challenging: string[];
        neutral: string[];
        mixed: string[];
    };
    rankingPolicy: {
        directMatchBonus: number;
        domainRelevanceBonus: number;
        activeTimingBonus: number;
        multiEngineBonus: number;
    };
}
export declare const PERSONAL_QUERY_V1: QueryProfile;
