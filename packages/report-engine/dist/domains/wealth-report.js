import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
import { detectConvergenceForDomain } from '../synthesis/convergence-detector.js';
import { detectContradictionForDomain } from '../synthesis/contradiction-detector.js';
import { evaluateDomainConfidence } from '../synthesis/report-confidence.js';
export function buildWealthReportSection(rulesResult, timingResult, ashtakavarga, yogaAnalysis) {
    const domain = 'WEALTH';
    const rawEvidence = [];
    if (rulesResult?.evaluatedRules) {
        for (const r of rulesResult.evaluatedRules) {
            if (r.active && (r.domain === 'WEALTH' || r.domain === 'FINANCE')) {
                rawEvidence.push(createEvidenceItem(`rule_${r.id}`, 'rules-engine', 'RULE_ACTIVATION', `${r.title}: ${r.description || r.evidence?.join(', ')}`, r.category === 'CHALLENGE' ? 'CHALLENGING' : 'SUPPORTIVE', r.weight >= 1.5 ? 'HIGH' : 'MEDIUM', 'WEALTH', r.id, r));
            }
        }
    }
    if (yogaAnalysis?.results) {
        for (const y of yogaAnalysis.results) {
            if (y.status === 'DETECTED' && y.category === 'DHANA') {
                rawEvidence.push(createEvidenceItem(`yoga_wealth_${y.id}`, 'yoga-engine', 'DHANA_YOGA', `${y.name} (Dhana Yoga) detected, indicating wealth lord associations.`, 'SUPPORTIVE', 'HIGH', 'WEALTH', y.id, y));
            }
        }
    }
    if (ashtakavarga?.sav?.signPoints) {
        const h2Pts = ashtakavarga.sav.signPoints['Aries'] || 28; // fallback placeholder for sign check
        rawEvidence.push(createEvidenceItem('ashtakavarga_wealth_sav', 'ashtakavarga-engine', 'SAV_POINTS', `SAV total bindus support general wealth and resource stability.`, 'FACTUAL', 'MEDIUM', 'WEALTH', 'SAV_WEALTH', ashtakavarga.sav));
    }
    if (timingResult?.domainTimelines) {
        const dt = timingResult.domainTimelines.find((t) => t.domain === 'WEALTH' || t.domain === 'FINANCE');
        if (dt) {
            rawEvidence.push(createEvidenceItem('timing_wealth_timeline', 'timing-engine', 'TIMING_ACTIVITY', `Wealth Domain Timing status: ${dt.status} (Score: ${dt.score.toFixed(1)}).`, dt.status === 'SUPPORTIVE' || dt.status === 'HIGH_ACTIVITY'
                ? 'SUPPORTIVE'
                : dt.status === 'CHALLENGING'
                    ? 'CHALLENGING'
                    : 'NEUTRAL', 'HIGH', 'WEALTH', 'TIMING_WEALTH', dt));
        }
    }
    const deduplicated = deduplicateEvidence(rawEvidence);
    const prioritized = prioritizeEvidence(deduplicated);
    const partitioned = partitionEvidenceByConflict(prioritized);
    const convergence = detectConvergenceForDomain(domain, prioritized);
    const contradiction = detectContradictionForDomain(domain, partitioned);
    const confidence = evaluateDomainConfidence(convergence, contradiction, prioritized);
    const summary = `Wealth & Assets Domain Report: Evaluated ${prioritized.length} evidence items from Rules, Dhana Yogas, Ashtakavarga, and Timing engines. Convergence Level: ${convergence.level}. Mixed Signals: ${contradiction.mixedSignals ? 'YES' : 'NO'}. Framework Confidence: ${confidence}.`;
    return {
        id: 'wealth_report',
        title: 'Wealth & Finances Domain Report',
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
