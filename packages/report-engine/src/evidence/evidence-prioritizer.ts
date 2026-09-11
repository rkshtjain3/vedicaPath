import { ReportEvidence, EvidenceImportance } from '../types/evidence-types.js';

const IMPORTANCE_WEIGHTS: Record<EvidenceImportance, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function prioritizeEvidence(evidenceList: ReportEvidence[]): ReportEvidence[] {
  return [...evidenceList].sort((a, b) => {
    // 1. Importance (HIGH > MEDIUM > LOW)
    const weightDiff = IMPORTANCE_WEIGHTS[b.importance] - IMPORTANCE_WEIGHTS[a.importance];
    if (weightDiff !== 0) return weightDiff;

    // 2. Source Engine alphabetically
    const engineDiff = a.sourceEngine.localeCompare(b.sourceEngine);
    if (engineDiff !== 0) return engineDiff;

    // 3. Source ID alphabetically
    return (a.sourceId || a.id).localeCompare(b.sourceId || b.id);
  });
}
