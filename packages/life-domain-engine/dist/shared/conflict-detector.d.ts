import { DomainEvidenceItem } from '../types.js';
export interface ConflictDetectionResult {
    present: boolean;
    description: string;
    conflictingPairs: Array<{
        support: DomainEvidenceItem;
        challenge: DomainEvidenceItem;
    }>;
}
export declare function detectEvidenceConflicts(supporting: DomainEvidenceItem[], challenging: DomainEvidenceItem[]): ConflictDetectionResult;
//# sourceMappingURL=conflict-detector.d.ts.map