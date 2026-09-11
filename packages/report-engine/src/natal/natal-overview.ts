import { buildLagnaSummary } from './lagna-summary.js';
import { buildMoonSummary } from './moon-summary.js';
import { buildPlanetStructureSummary } from './planet-summary.js';
import { buildChartPatternSummary } from './chart-pattern-summary.js';
import { ReportSection } from '../types/report-types.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';

export function buildNatalOverviewSection(chart: any, analysis: any, vargaComparison?: any): ReportSection {
  const lagna = buildLagnaSummary(chart);
  const moon = buildMoonSummary(chart);
  const structure = buildPlanetStructureSummary(chart, analysis, vargaComparison);
  const pattern = buildChartPatternSummary(chart);

  const rawEvidence = [
    ...lagna.evidence,
    ...moon.evidence,
    ...structure.evidence,
    ...pattern.evidence,
  ];

  const deduplicated = deduplicateEvidence(rawEvidence);
  const prioritized = prioritizeEvidence(deduplicated);
  const partitioned = partitionEvidenceByConflict(prioritized);

  const summaryText = `${lagna.text} ${moon.text} ${structure.text}`;

  return {
    id: 'natal_overview',
    title: 'Natal Overview',
    summary: summaryText,
    evidence: prioritized,
    supportiveEvidence: partitioned.supportive,
    challengingEvidence: partitioned.challenging,
    neutralEvidence: [...partitioned.neutral, ...partitioned.factual],
    mixedSignals: false,
    confidence: 'HIGH',
  };
}
