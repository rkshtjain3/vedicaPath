import { ReportEvidence } from '../types/evidence-types.js';

export function deduplicateEvidence(evidenceList: ReportEvidence[]): ReportEvidence[] {
  const seenIds = new Set<string>();
  const deduplicated: ReportEvidence[] = [];

  for (const item of evidenceList) {
    const key = `${item.sourceEngine}_${item.sourceType}_${item.sourceId}_${item.summary}`;
    if (!seenIds.has(key)) {
      seenIds.add(key);
      deduplicated.push(item);
    }
  }

  return deduplicated;
}
