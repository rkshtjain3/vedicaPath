import { EvidenceDirection, EvidenceStrength, LifeDomain, TimingEvidence } from '../types.js';
export interface CreateTimingEvidenceParams {
    id: string;
    periodId: string;
    domain: LifeDomain;
    planet: string;
    sourceEngine: string;
    sourceRuleId?: string;
    description: string;
    direction: EvidenceDirection;
    strength: EvidenceStrength;
    whyEvidence?: string[];
}
export declare function createTimingEvidence(params: CreateTimingEvidenceParams): TimingEvidence;
//# sourceMappingURL=evidence.d.ts.map