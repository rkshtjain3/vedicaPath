import { TimingEvidence } from '../types.js';
export interface TimingScoringResult {
    supportScore: number;
    challengeScore: number;
    neutralScore: number;
    supportCount: number;
    challengeCount: number;
    neutralCount: number;
    totalEvidence: number;
}
export declare function calculateTimingScoring(evidenceList: TimingEvidence[]): TimingScoringResult;
//# sourceMappingURL=scoring.d.ts.map