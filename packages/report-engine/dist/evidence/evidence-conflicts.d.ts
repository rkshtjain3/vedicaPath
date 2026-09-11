import { ReportEvidence } from '../types/evidence-types.js';
export interface PartitionedEvidence {
    supportive: ReportEvidence[];
    challenging: ReportEvidence[];
    neutral: ReportEvidence[];
    factual: ReportEvidence[];
    mixedSignals: boolean;
}
export declare function partitionEvidenceByConflict(evidenceList: ReportEvidence[]): PartitionedEvidence;
