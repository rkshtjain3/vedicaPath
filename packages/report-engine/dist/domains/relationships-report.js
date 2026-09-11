import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
import { detectConvergenceForDomain } from '../synthesis/convergence-detector.js';
import { detectContradictionForDomain } from '../synthesis/contradiction-detector.js';
import { evaluateDomainConfidence } from '../synthesis/report-confidence.js';
export function buildRelationshipsReportSection(rulesResult, timingResult, analysis, d9Analysis) {
    const domain = 'RELATIONSHIPS';
    const rawEvidence = [];
    if (rulesResult?.evaluatedRules) {
        for (const r of rulesResult.evaluatedRules) {
            if (r.active && (r.domain === 'RELATIONSHIPS' || r.domain === 'MARRIAGE')) {
                rawEvidence.push(createEvidenceItem(`rule_${r.id}`, 'rules-engine', 'RULE_ACTIVATION', `${r.title}: ${r.description || r.evidence?.join(', ')}`, r.category === 'CHALLENGE' ? 'CHALLENGING' : 'SUPPORTIVE', r.weight >= 1.5 ? 'HIGH' : 'MEDIUM', 'RELATIONSHIPS', r.id, r));
            }
        }
    }
    // 7th Lord fact from D1 Rashi and D9 Navamsa
    const h7Lord = analysis?.houseLords?.find((hl) => hl.house === 7)?.lord || 'Venus/Jupiter';
    rawEvidence.push(createEvidenceItem('relationship_h7_lord', 'analysis-engine', 'HOUSE_7_LORD', `7th House Lord is ${h7Lord}. D9 Navamsa chart provides subtle relation facts.`, 'FACTUAL', 'MEDIUM', 'RELATIONSHIPS', `LORD_7_${h7Lord}`, { h7Lord, d9Analysis }));
    if (timingResult?.domainTimelines) {
        const dt = timingResult.domainTimelines.find((t) => t.domain === 'RELATIONSHIPS' || t.domain === 'MARRIAGE');
        if (dt) {
            rawEvidence.push(createEvidenceItem('timing_relationship_timeline', 'timing-engine', 'TIMING_ACTIVITY', `Relationships Domain Timing status: ${dt.status} (Score: ${dt.score.toFixed(1)}).`, dt.status === 'SUPPORTIVE' || dt.status === 'HIGH_ACTIVITY'
                ? 'SUPPORTIVE'
                : dt.status === 'CHALLENGING'
                    ? 'CHALLENGING'
                    : 'NEUTRAL', 'HIGH', 'RELATIONSHIPS', 'TIMING_RELATIONSHIPS', dt));
        }
    }
    const deduplicated = deduplicateEvidence(rawEvidence);
    const prioritized = prioritizeEvidence(deduplicated);
    const partitioned = partitionEvidenceByConflict(prioritized);
    const convergence = detectConvergenceForDomain(domain, prioritized);
    const contradiction = detectContradictionForDomain(domain, partitioned);
    const confidence = evaluateDomainConfidence(convergence, contradiction, prioritized);
    const summary = `Relationships Domain Report: Evaluated ${prioritized.length} evidence items from D1 Rashi, D9 Navamsa, Rules, and Timing engines. Convergence Level: ${convergence.level}. Mixed Signals: ${contradiction.mixedSignals ? 'YES' : 'NO'}. Framework Confidence: ${confidence}.`;
    return {
        id: 'relationships_report',
        title: 'Relationships & Partnerships Domain Report',
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
