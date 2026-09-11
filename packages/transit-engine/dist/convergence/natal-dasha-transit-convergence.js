import { PERSONAL_TRANSIT_V1 } from '../profile.js';
import { createHash } from 'crypto';
export function evaluateNatalDashaTransitConvergence(input) {
    const domains = [
        'CAREER',
        'WEALTH',
        'RELATIONSHIPS',
        'HEALTH',
        'EDUCATION',
        'PROPERTY',
        'SPIRITUALITY',
    ];
    const domainConvergence = {
        CAREER: createEmptyConvergenceResult('CAREER'),
        WEALTH: createEmptyConvergenceResult('WEALTH'),
        RELATIONSHIPS: createEmptyConvergenceResult('RELATIONSHIPS'),
        HEALTH: createEmptyConvergenceResult('HEALTH'),
        EDUCATION: createEmptyConvergenceResult('EDUCATION'),
        PROPERTY: createEmptyConvergenceResult('PROPERTY'),
        SPIRITUALITY: createEmptyConvergenceResult('SPIRITUALITY'),
    };
    const highConvergenceDomains = [];
    const mixedSignalDomains = [];
    const activeDashaContext = {
        mahadasha: input.timelineAnalysis?.currentPeriod?.mahadasha?.lord,
        antardasha: input.timelineAnalysis?.currentPeriod?.antardasha?.lord,
        pratyantardasha: input.timelineAnalysis?.currentPeriod?.pratyantardasha?.lord,
    };
    for (const dom of domains) {
        const supportive = [];
        const challenging = [];
        // 1. Collect Natal Evidence
        const ldDomain = input.lifeDomainAnalysis?.domains?.[dom];
        if (ldDomain?.supportiveFactors) {
            for (const f of ldDomain.supportiveFactors) {
                supportive.push({
                    sourceEngine: 'NATAL',
                    evidenceId: `NATAL-${dom}-${f.id || f.sourceRuleId || 'fact'}`,
                    description: f.description || f.ruleName || 'Natal supportive placement',
                    direction: 'SUPPORTIVE',
                    weight: 1.2,
                });
            }
        }
        if (ldDomain?.challengingFactors) {
            for (const f of ldDomain.challengingFactors) {
                challenging.push({
                    sourceEngine: 'NATAL',
                    evidenceId: `NATAL-${dom}-${f.id || f.sourceRuleId || 'fact'}`,
                    description: f.description || f.ruleName || 'Natal challenging placement',
                    direction: 'CHALLENGING',
                    weight: 1.2,
                });
            }
        }
        // 2. Collect Dasha / Timeline Evidence
        const timelineDomWindows = input.timelineAnalysis?.domainContexts?.[dom] || [];
        for (const win of timelineDomWindows) {
            if (win.supportingFactors) {
                for (const s of win.supportingFactors) {
                    supportive.push({
                        sourceEngine: 'DASHA',
                        evidenceId: `DASHA-${dom}-${s.id || s.sourceRuleId}`,
                        description: s.description || 'Dasha active lord supportive context',
                        direction: 'SUPPORTIVE',
                        weight: 1.5,
                    });
                }
            }
            if (win.challengingFactors) {
                for (const c of win.challengingFactors) {
                    challenging.push({
                        sourceEngine: 'DASHA',
                        evidenceId: `DASHA-${dom}-${c.id || c.sourceRuleId}`,
                        description: c.description || 'Dasha active lord challenging context',
                        direction: 'CHALLENGING',
                        weight: 1.5,
                    });
                }
            }
        }
        // 3. Collect Transit Evidence
        const trDom = input.transitAnalysis?.domainEvidence?.[dom];
        if (trDom?.evidence) {
            for (const te of trDom.evidence) {
                if (te.direction === 'SUPPORTIVE') {
                    supportive.push({
                        sourceEngine: 'TRANSIT',
                        evidenceId: te.id,
                        description: te.description,
                        direction: 'SUPPORTIVE',
                        weight: te.weight || 1.0,
                    });
                }
                else if (te.direction === 'CHALLENGING') {
                    challenging.push({
                        sourceEngine: 'TRANSIT',
                        evidenceId: te.id,
                        description: te.description,
                        direction: 'CHALLENGING',
                        weight: te.weight || 1.0,
                    });
                }
            }
        }
        // Anti-Double-Counting Engine Source Diversity Calculation
        const supportiveSources = new Set(supportive.map((e) => e.sourceEngine));
        const challengingSources = new Set(challenging.map((e) => e.sourceEngine));
        const mixedSignals = supportive.length > 0 && challenging.length > 0 && supportiveSources.size >= 1 && challengingSources.size >= 1;
        let convergenceLevel = 'LIMITED_EVIDENCE';
        if (mixedSignals && supportiveSources.size >= 2 && challengingSources.size >= 2) {
            convergenceLevel = 'MIXED_SIGNALS';
            mixedSignalDomains.push(dom);
        }
        else if (supportiveSources.size >= 3) {
            // Agreement across Natal + Dasha + Transit!
            convergenceLevel = 'HIGH_CONVERGENCE';
            highConvergenceDomains.push(dom);
        }
        else if (supportiveSources.size >= 2 || supportive.length >= 2) {
            convergenceLevel = 'MODERATE_CONVERGENCE';
        }
        else if (mixedSignals) {
            convergenceLevel = 'MIXED_SIGNALS';
            mixedSignalDomains.push(dom);
        }
        const whyEvidence = [
            `Domain: ${dom}`,
            `Supportive Sources (${supportiveSources.size}): ${Array.from(supportiveSources).join(', ')}`,
            `Challenging Sources (${challengingSources.size}): ${Array.from(challengingSources).join(', ')}`,
            `Convergence Classification: ${convergenceLevel}`,
            `Anti-Double-Counting Policy applied: distinct engine layers required for high convergence.`,
        ];
        domainConvergence[dom] = {
            domain: dom,
            natalEvidenceCount: supportive.filter((e) => e.sourceEngine === 'NATAL').length + challenging.filter((e) => e.sourceEngine === 'NATAL').length,
            dashaEvidenceCount: supportive.filter((e) => e.sourceEngine === 'DASHA').length + challenging.filter((e) => e.sourceEngine === 'DASHA').length,
            transitEvidenceCount: supportive.filter((e) => e.sourceEngine === 'TRANSIT').length + challenging.filter((e) => e.sourceEngine === 'TRANSIT').length,
            ashtakavargaEvidenceCount: 0,
            supportiveEvidence: supportive,
            challengingEvidence: challenging,
            mixedSignals,
            convergenceLevel,
            whyEvidence,
            disclaimer: dom === 'HEALTH' ? 'Astrological health context only. This does not constitute medical advice or diagnosis.' : undefined,
        };
    }
    const hashInput = {
        profileVersion: PERSONAL_TRANSIT_V1,
        activeDashaContext,
        highConvergenceDomains,
        mixedSignalDomains,
    };
    const hashKey = createHash('sha256')
        .update(JSON.stringify(hashInput))
        .digest('hex');
    return {
        profileVersion: PERSONAL_TRANSIT_V1,
        calculatedAt: new Date().toISOString(),
        activeDashaContext,
        domainConvergence,
        convergenceSummary: {
            totalEnginesEvaluated: 4, // NATAL, DASHA, TRANSIT, ASHTAKAVARGA
            highConvergenceDomains,
            mixedSignalDomains,
        },
        reproducibilityHash: hashKey,
    };
}
function createEmptyConvergenceResult(domain) {
    return {
        domain,
        natalEvidenceCount: 0,
        dashaEvidenceCount: 0,
        transitEvidenceCount: 0,
        ashtakavargaEvidenceCount: 0,
        supportiveEvidence: [],
        challengingEvidence: [],
        mixedSignals: false,
        convergenceLevel: 'LIMITED_EVIDENCE',
        whyEvidence: [],
    };
}
