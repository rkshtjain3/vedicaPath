import { ReportConfidenceLevel } from '../types/report-types.js';
import { ConvergenceResult, ContradictionResult } from '../types/domain-types.js';
import { ReportEvidence } from '../types/evidence-types.js';

export function evaluateDomainConfidence(
  convergence: ConvergenceResult,
  contradiction: ContradictionResult,
  evidenceList: ReportEvidence[]
): ReportConfidenceLevel {
  if (evidenceList.length === 0) {
    return 'LOW';
  }

  if (convergence.level === 'HIGH' && !contradiction.mixedSignals) {
    return 'HIGH';
  }

  if (convergence.level === 'HIGH' || (convergence.level === 'MODERATE' && !contradiction.mixedSignals)) {
    return 'MEDIUM';
  }

  if (contradiction.mixedSignals || evidenceList.length < 3) {
    return 'LOW';
  }

  return 'MEDIUM';
}
