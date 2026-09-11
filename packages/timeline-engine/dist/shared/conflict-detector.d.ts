import { TimingEvidence } from '../types.js';
export interface ConflictingEvidencePair {
    support: TimingEvidence;
    challenge: TimingEvidence;
}
export declare function detectConflictPairs(evidenceList: TimingEvidence[]): ConflictingEvidencePair[];
//# sourceMappingURL=conflict-detector.d.ts.map