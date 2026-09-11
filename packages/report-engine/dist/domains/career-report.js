import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
import { partitionEvidenceByConflict } from '../evidence/evidence-conflicts.js';
import { prioritizeEvidence } from '../evidence/evidence-prioritizer.js';
import { deduplicateEvidence } from '../evidence/evidence-deduplicator.js';
import { detectConvergenceForDomain } from '../synthesis/convergence-detector.js';
import { detectContradictionForDomain } from '../synthesis/contradiction-detector.js';
import { evaluateDomainConfidence } from '../synthesis/report-confidence.js';
export function buildCareerReportSection(rulesResult, timingResult, strengthAnalysis, yogaAnalysis, crossChartAnalysis, careerD10Result) {
    const domain = 'CAREER';
    const rawEvidence = [];
    // 1. Rules Engine evidence
    if (rulesResult?.evaluatedRules) {
        for (const r of rulesResult.evaluatedRules) {
            if (r.active && r.domain === 'CAREER') {
                rawEvidence.push(createEvidenceItem(`rule_${r.id}`, 'rules-engine', 'RULE_ACTIVATION', `${r.title}: ${r.description || r.evidence?.join(', ')}`, r.category === 'CHALLENGE' ? 'CHALLENGING' : 'SUPPORTIVE', r.weight >= 1.5 ? 'HIGH' : 'MEDIUM', 'CAREER', r.id, r));
            }
        }
    }
    // 2. D10 Career Rules evidence
    if (careerD10Result?.evaluatedRules) {
        for (const r of careerD10Result.evaluatedRules) {
            if (r.active) {
                rawEvidence.push(createEvidenceItem(`career_d10_${r.id}`, 'rules-engine', 'D10_CAREER_RULE', `D10 Dashamsa Fact (${r.title}): ${r.description || r.evidence?.join(', ')}`, r.category === 'CHALLENGE' ? 'CHALLENGING' : 'SUPPORTIVE', 'HIGH', 'CAREER', r.id, r));
            }
        }
    }
    // 3. Cross-chart facts
    if (crossChartAnalysis?.career?.facts) {
        for (const f of crossChartAnalysis.career.facts) {
            rawEvidence.push(createEvidenceItem(`cross_chart_${f.id}`, 'divisional-chart-engine', 'CROSS_CHART_FACT', `Cross-chart fact: ${f.title} (${f.description})`, 'FACTUAL', 'MEDIUM', 'CAREER', f.id, f));
        }
    }
    // 4. Relevant Yogas
    if (yogaAnalysis?.results) {
        for (const y of yogaAnalysis.results) {
            if (y.status === 'DETECTED' && (y.category === 'MAHAPURUSHA' || y.category === 'RAJA')) {
                rawEvidence.push(createEvidenceItem(`yoga_career_${y.id}`, 'yoga-engine', 'YOGA_CAREER_SUPPORT', `${y.name} (${y.category}) detected, providing structural support to chart authority.`, 'SUPPORTIVE', 'HIGH', 'CAREER', y.id, y));
            }
        }
    }
    // 5. Timing
    if (timingResult?.domainTimelines) {
        const dt = timingResult.domainTimelines.find((t) => t.domain === 'CAREER');
        if (dt) {
            rawEvidence.push(createEvidenceItem('timing_career_timeline', 'timing-engine', 'TIMING_ACTIVITY', `Career Domain Timing status: ${dt.status} (Weight: ${dt.score.toFixed(1)}).`, dt.status === 'SUPPORTIVE' || dt.status === 'HIGH_ACTIVITY'
                ? 'SUPPORTIVE'
                : dt.status === 'CHALLENGING'
                    ? 'CHALLENGING'
                    : 'NEUTRAL', 'HIGH', 'CAREER', 'TIMING_CAREER', dt));
        }
    }
    const deduplicated = deduplicateEvidence(rawEvidence);
    const prioritized = prioritizeEvidence(deduplicated);
    const partitioned = partitionEvidenceByConflict(prioritized);
    const convergence = detectConvergenceForDomain(domain, prioritized);
    const contradiction = detectContradictionForDomain(domain, partitioned);
    const confidence = evaluateDomainConfidence(convergence, contradiction, prioritized);
    const summary = `Career Domain Report: Evaluated ${prioritized.length} evidence items across D1, D10 Dashamsa, Rules, Yogas, and Timing engines. Convergence Level: ${convergence.level}. Mixed Signals: ${contradiction.mixedSignals ? 'YES (both supportive and challenging factors exist)' : 'NO'}. Framework Confidence: ${confidence}.`;
    return {
        id: 'career_report',
        title: 'Career & Vocation Domain Report',
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
