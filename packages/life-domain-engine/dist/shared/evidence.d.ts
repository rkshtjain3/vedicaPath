import { DomainEvidenceItem, EvidenceDirection, EvidenceStrength, LifeDomain } from '../types.js';
export interface CreateEvidenceParams {
    id: string;
    domain: LifeDomain;
    sourceEngine: string;
    sourceRuleId?: string;
    description: string;
    direction: EvidenceDirection;
    strength: EvidenceStrength;
    weight?: number;
    whyEvidence: string[];
}
export declare function createEvidenceItem(params: CreateEvidenceParams): DomainEvidenceItem;
//# sourceMappingURL=evidence.d.ts.map