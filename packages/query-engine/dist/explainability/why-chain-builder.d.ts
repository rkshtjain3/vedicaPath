import { QueryEvidenceItem } from '../types.js';
export interface WhyChain {
    evidenceId: string;
    title: string;
    sourceEngine: string;
    sourceRuleId?: string;
    steps: string[];
}
export declare function buildWhyChain(item: QueryEvidenceItem): WhyChain;
