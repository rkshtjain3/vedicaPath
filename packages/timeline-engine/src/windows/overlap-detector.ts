import { LifeDomain, TimingEvidence } from '../types.js';

export function filterEvidenceByDomain(
  evidenceList: TimingEvidence[],
  domain: LifeDomain
): TimingEvidence[] {
  return evidenceList.filter((e) => e.domain === domain);
}

export function detectOverlapLords(evidenceList: TimingEvidence[]): string[] {
  return Array.from(new Set(evidenceList.map((e) => e.planet)));
}
