import { BenchmarkCase, RootCauseClassification } from '@vedica/benchmark-store';
import { ComponentComparisonResult } from '@vedica/benchmark-store';
export interface DiagnosticCandidate {
    category: RootCauseClassification;
    type: RootCauseClassification;
    likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
    evidence: string[];
    recommendedInvestigation: string;
}
export interface MismatchDiagnosticResult {
    hasMismatch: boolean;
    totalFailedComponents: number;
    candidates: DiagnosticCandidate[];
    summary: string;
}
export declare function classifyMismatch(comparisonResults: ComponentComparisonResult[], benchmarkCase: BenchmarkCase): MismatchDiagnosticResult;
//# sourceMappingURL=mismatch-classifier.d.ts.map