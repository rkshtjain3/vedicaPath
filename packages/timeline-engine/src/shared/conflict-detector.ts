import { TimingEvidence } from '../types.js';

export interface ConflictingEvidencePair {
  support: TimingEvidence;
  challenge: TimingEvidence;
}

export function detectConflictPairs(
  evidenceList: TimingEvidence[]
): ConflictingEvidencePair[] {
  const supportItems = evidenceList.filter((e) => e.direction === 'SUPPORTIVE');
  const challengeItems = evidenceList.filter((e) => e.direction === 'CHALLENGING');

  const pairs: ConflictingEvidencePair[] = [];

  for (const s of supportItems) {
    for (const c of challengeItems) {
      if (s.planet === c.planet || s.domain === c.domain) {
        pairs.push({ support: s, challenge: c });
      }
    }
  }

  return pairs;
}
