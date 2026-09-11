import { createHash } from 'crypto';
import { PERSONAL_LIFE_DOMAIN_V1 } from '../profile.js';
import { evaluateCareerDomain } from '../domains/career.js';
import { evaluateWealthDomain } from '../domains/wealth.js';
import { evaluateRelationshipsDomain } from '../domains/relationships.js';
import { evaluateHealthDomain } from '../domains/health.js';
import { evaluateEducationDomain } from '../domains/education.js';
import { evaluatePropertyDomain } from '../domains/property.js';
import { evaluateSpiritualityDomain } from '../domains/spirituality.js';
export function evaluateLifeDomainEngine(engineData) {
    const career = evaluateCareerDomain(engineData);
    const wealth = evaluateWealthDomain(engineData);
    const relationships = evaluateRelationshipsDomain(engineData);
    const health = evaluateHealthDomain(engineData);
    const education = evaluateEducationDomain(engineData);
    const property = evaluatePropertyDomain(engineData);
    const spirituality = evaluateSpiritualityDomain(engineData);
    const domains = {
        CAREER: career,
        WEALTH: wealth,
        RELATIONSHIPS: relationships,
        HEALTH: health,
        EDUCATION: education,
        PROPERTY: property,
        SPIRITUALITY: spirituality,
    };
    const evaluatedRuleIdsSet = new Set();
    let totalEvidenceItems = 0;
    let mixedDomainCount = 0;
    const uniqueEngines = new Set();
    const domainKeys = [
        'CAREER',
        'WEALTH',
        'RELATIONSHIPS',
        'HEALTH',
        'EDUCATION',
        'PROPERTY',
        'SPIRITUALITY',
    ];
    let highestSupportScore = -1;
    let dominantDomain = 'CAREER';
    for (const key of domainKeys) {
        const d = domains[key];
        if (d.scoring.state === 'MIXED' || d.mixedSignals.present) {
            mixedDomainCount++;
        }
        if (d.scoring.supportScore > highestSupportScore) {
            highestSupportScore = d.scoring.supportScore;
            dominantDomain = key;
        }
        const allFactors = [
            ...(d.supportingFactors || []),
            ...(d.challengingFactors || []),
            ...(d.neutralFactors || []),
        ];
        totalEvidenceItems += allFactors.length;
        for (const f of allFactors) {
            if (f.sourceRuleId) {
                evaluatedRuleIdsSet.add(f.sourceRuleId);
            }
            if (f.sourceEngine) {
                uniqueEngines.add(f.sourceEngine);
            }
        }
    }
    const evaluatedRuleIds = Array.from(evaluatedRuleIdsSet).sort();
    // Create deterministic hash for reproducibility audit
    const canonicalString = [
        PERSONAL_LIFE_DOMAIN_V1,
        ...evaluatedRuleIds,
        ...domainKeys.map((k) => `${k}:${domains[k].state}:${domains[k].scoring.supportScore}/${domains[k].scoring.challengeScore}`),
    ].join('|');
    let hashKey = '';
    try {
        hashKey = createHash('sha256').update(canonicalString).digest('hex');
    }
    catch {
        let hash = 0;
        for (let i = 0; i < canonicalString.length; i++) {
            const char = canonicalString.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        hashKey = `ld-hash-${Math.abs(hash).toString(16)}`;
    }
    return {
        profileVersion: PERSONAL_LIFE_DOMAIN_V1,
        evaluatedAt: new Date().toISOString(),
        evaluatedRuleIds,
        domains,
        summary: {
            totalEnginesEvaluated: uniqueEngines.size,
            totalEvidenceItems,
            mixedDomainCount,
            dominantDomain,
        },
        audit: {
            hashKey,
        },
    };
}
//# sourceMappingURL=life-domain-evaluator.js.map