import { ReportConfidenceLevel } from '../types/report-types.js';
import { ConvergenceResult, ContradictionResult } from '../types/domain-types.js';
import { ReportEvidence } from '../types/evidence-types.js';
export declare function evaluateDomainConfidence(convergence: ConvergenceResult, contradiction: ContradictionResult, evidenceList: ReportEvidence[]): ReportConfidenceLevel;
