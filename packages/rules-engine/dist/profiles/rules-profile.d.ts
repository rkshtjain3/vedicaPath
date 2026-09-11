import { RuleDomain } from '../types/rule-types.js';
export interface DomainScoringBoundaries {
    lowMax: number;
    moderateMax: number;
}
export interface RulesProfile {
    version: string;
    name: string;
    calculationProfileVersion: string;
    analysisProfileVersion: string;
    enabledRules: Record<RuleDomain, string[]>;
    scoringBoundaries: Record<RuleDomain, DomainScoringBoundaries>;
}
export declare const PERSONAL_RULES_V1: RulesProfile;
//# sourceMappingURL=rules-profile.d.ts.map