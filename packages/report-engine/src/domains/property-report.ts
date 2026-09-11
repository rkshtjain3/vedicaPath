import { DomainReportSection, LifeDomain } from '../types/report-types.js';
import { ReportEvidence } from '../types/evidence-types.js';
import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
import { detectConvergenceForDomain } from '../synthesis/convergence-detector.js';
import { detectContradictionForDomain } from '../synthesis/contradiction-detector.js';
import { evaluateDomainConfidence } from '../synthesis/report-confidence.js';

export function buildPropertyReportSection(
  rulesResult: any,
  timingResult: any,
  analysis: any
): DomainReportSection {
  const domain: LifeDomain = 'PROPERTY';
  const rawEvidence: ReportEvidence[] = [];

  if (rulesResult?.evaluatedRules) {
    for (const r of rulesResult.evaluatedRules) {
      if (r.active && (r.domain === 'PROPERTY' || r.domain === 'VEHICLES')) {
        rawEvidence.push(
          createEvidenceItem(
            `rule_${r.id}`,
            'rules-engine',
            'RULE_ACTIVATION',
            `${r.title}: ${r.description || r.evidence?.join(', ')}`,
            r.category === 'CHALLENGE' ? 'CHALLENGING' : 'SUPPORTIVE',
            r.weight >= 1.5 ? 'HIGH' : 'MEDIUM',
            'PROPERTY',
            r.id,
            r
          )
        );
      }
    }
  }

  const h4Lord = analysis?.houseLords?.find((hl: any) => hl.house === 4)?.lord || 'Mars/Moon';
  rawEvidence.push(
    createEvidenceItem(
      'property_h4_lord',
      'analysis-engine',
      'HOUSE_4_LORD',
      `4th House Lord (Real Estate & Property) is ${h4Lord}.`,
      'FACTUAL',
      'MEDIUM',
      'PROPERTY',
      `LORD_4_${h4Lord}`,
      { h4Lord }
    )
  );

  if (timingResult?.domainTimelines) {
    const dt = timingResult.domainTimelines.find((t: any) => t.domain === 'PROPERTY' || t.domain === 'REAL_ESTATE');
    if (dt) {
      rawEvidence.push(
        createEvidenceItem(
          'timing_property_timeline',
          'timing-engine',
          'TIMING_ACTIVITY',
          `Property Domain Timing status: ${dt.status} (Score: ${dt.score.toFixed(1)}).`,
          dt.status === 'SUPPORTIVE' || dt.status === 'HIGH_ACTIVITY'
            ? 'SUPPORTIVE'
            : dt.status === 'CHALLENGING'
            ? 'CHALLENGING'
            : 'NEUTRAL',
          'HIGH',
          'PROPERTY',
          'TIMING_PROPERTY',
          dt
        )
      );
    }
  }

  const deduplicated = deduplicateEvidence(rawEvidence);
  const prioritized = prioritizeEvidence(deduplicated);
  const partitioned = partitionEvidenceByConflict(prioritized);

  const convergence = detectConvergenceForDomain(domain, prioritized);
  const contradiction = detectContradictionForDomain(domain, partitioned);
  const confidence = evaluateDomainConfidence(convergence, contradiction, prioritized);

  const summary = `Property & Real Estate Domain Report: Evaluated ${prioritized.length} evidence items from 4th House Lordship, Rules, and Timing engines. Convergence Level: ${
    convergence.level
  }. Mixed Signals: ${contradiction.mixedSignals ? 'YES' : 'NO'}. Framework Confidence: ${confidence}.`;

  return {
    id: 'property_report',
    title: 'Property & Real Estate Domain Report',
    summary,
    domain,
    evidence: prioritized,
    supportiveEvidence: partitioned.supportive,
    challengingEvidence: partitioned.challenging,
    neutralEvidence: [...partitioned.neutral, ...partitioned.factual],
    mixedSignals: contradiction.mixedSignals,
    confidence,
    convergence,
    contradiction,
  };
}
