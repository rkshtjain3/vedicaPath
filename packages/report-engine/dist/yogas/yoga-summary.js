import { normalizeYogaEvidence } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
export function buildYogaSection(yogaAnalysis) {
    const detectedEvidence = normalizeYogaEvidence(yogaAnalysis);
    const notDetectedYogas = (yogaAnalysis?.results || [])
        .filter((y) => y.status === 'NOT_DETECTED')
        .map((y) => createEvidenceItem(`yoga_nd_${y.id}`, 'yoga-engine', 'YOGA_NOT_DETECTED', `${y.name} (${y.category}) condition check was not satisfied.`, 'NEUTRAL', 'LOW', 'YOGAS', y.id, y));
    const rawEvidence = [...detectedEvidence, ...notDetectedYogas];
    const deduplicated = deduplicateEvidence(rawEvidence);
    const prioritized = prioritizeEvidence(deduplicated);
    const partitioned = partitionEvidenceByConflict(prioritized);
    const detectedNames = (yogaAnalysis?.results || [])
        .filter((y) => y.status === 'DETECTED')
        .map((y) => y.name);
    const summary = `Classical Yoga Engine evaluated ${yogaAnalysis?.totalEvaluated || 24} canonical Yogas. Detected ${yogaAnalysis?.detectedCount || 0} Yogas: ${detectedNames.length > 0 ? detectedNames.join(', ') : 'None'}.`;
    return {
        id: 'yogas_summary',
        title: 'Classical Yogas Summary',
        summary,
        evidence: prioritized,
        supportiveEvidence: partitioned.supportive,
        challengingEvidence: partitioned.challenging,
        neutralEvidence: [...partitioned.neutral, ...partitioned.factual],
        mixedSignals: false,
        confidence: 'HIGH',
    };
}
