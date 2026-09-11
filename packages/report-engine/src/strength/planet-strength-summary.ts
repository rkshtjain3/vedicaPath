import { normalizeStrengthEvidence } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
import { ReportSection } from '../types/report-types.js';

export function buildPlanetaryStrengthSection(strengthAnalysis: any, shadbala: any): ReportSection {
  const rawEvidence = normalizeStrengthEvidence(strengthAnalysis, shadbala);
  const deduplicated = deduplicateEvidence(rawEvidence);
  const prioritized = prioritizeEvidence(deduplicated);
  const partitioned = partitionEvidenceByConflict(prioritized);

  const strongPlanets = strengthAnalysis?.planets
    ?.filter((p: any) => p.overallStrength === 'STRONG' || p.overallStrength === 'VERY_STRONG')
    .map((p: any) => p.planet) || [];

  const challengedPlanets = strengthAnalysis?.planets
    ?.filter((p: any) => p.overallStrength === 'WEAK' || p.overallStrength === 'CHALLENGED')
    .map((p: any) => p.planet) || [];

  const summary = `Planetary Strength Engine evaluated ${strengthAnalysis?.planets?.length || 9} planets. Strongest indicators: ${
    strongPlanets.length > 0 ? strongPlanets.join(', ') : 'None'
  }. Challenged indicators: ${
    challengedPlanets.length > 0 ? challengedPlanets.join(', ') : 'None'
  }. Note: Current Shadbala implementation provides component-level evidence; components marked PARTIAL or FOUNDATION represent non-exhaustive classical scores.`;

  return {
    id: 'planetary_strength',
    title: 'Planetary Strength & Shadbala Summary',
    summary,
    evidence: prioritized,
    supportiveEvidence: partitioned.supportive,
    challengingEvidence: partitioned.challenging,
    neutralEvidence: [...partitioned.neutral, ...partitioned.factual],
    mixedSignals: partitioned.mixedSignals,
    confidence: 'HIGH',
  };
}
