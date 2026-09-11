import { normalizeTimingEvidence } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
export function buildTimingSection(timingResult) {
    const rawEvidence = normalizeTimingEvidence(timingResult);
    const deduplicated = deduplicateEvidence(rawEvidence);
    const prioritized = prioritizeEvidence(deduplicated);
    const partitioned = partitionEvidenceByConflict(prioritized);
    const activeRulers = timingResult?.dashaActivation?.activeRulers?.join(' - ') || 'Unknown';
    const summary = `Timing Engine evaluated active multi-level Dasha rulers (${activeRulers}) and transits. Framework provides period-level activity analysis without predicting specific dates.`;
    return {
        id: 'timing_summary',
        title: 'Current Astrological Timing Summary',
        summary,
        evidence: prioritized,
        supportiveEvidence: partitioned.supportive,
        challengingEvidence: partitioned.challenging,
        neutralEvidence: [...partitioned.neutral, ...partitioned.factual],
        mixedSignals: partitioned.mixedSignals,
        confidence: 'HIGH',
    };
}
