import { LifeDomain, QueryEvidenceItem } from '../types.js';

export function retrieveLifeDomainEvidence(
  calculationData: any,
  targetDomain?: LifeDomain,
  targetPlanet?: string
): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];
  const lda = calculationData.lifeDomainAnalysis || {};
  const domains = lda.domains || lda;

  if (typeof domains !== 'object' || !domains) return items;

  for (const [domKey, domData] of Object.entries(domains) as [string, any][]) {
    const domainUpper = domKey.toUpperCase() as LifeDomain;
    if (targetDomain && domainUpper !== targetDomain) continue;
    if (!domData) continue;

    // Supporting Factors
    if (domData.supportingFactors && Array.isArray(domData.supportingFactors)) {
      for (const item of domData.supportingFactors) {
        if (targetPlanet && !item.description?.toLowerCase().includes(targetPlanet.toLowerCase())) continue;
        items.push({
          id: item.id || `DOMAIN-SUPPORT-${domainUpper}-${items.length}`,
          sourceEngine: 'LIFE_DOMAIN',
          sourceRuleId: item.sourceRuleId || 'DOMAIN-EVIDENCE',
          category: `Life Domain: ${domainUpper}`,
          domain: domainUpper,
          direction: 'SUPPORTIVE',
          title: item.description?.substring(0, 60) || `${domainUpper} Supportive Factor`,
          description: item.description || '',
          weight: item.weight || 1.0,
          whyEvidence: item.whyEvidence || [item.description || 'Supportive domain indicator'],
        });
      }
    }

    // Challenging Factors
    if (domData.challengingFactors && Array.isArray(domData.challengingFactors)) {
      for (const item of domData.challengingFactors) {
        if (targetPlanet && !item.description?.toLowerCase().includes(targetPlanet.toLowerCase())) continue;
        items.push({
          id: item.id || `DOMAIN-CHALLENGE-${domainUpper}-${items.length}`,
          sourceEngine: 'LIFE_DOMAIN',
          sourceRuleId: item.sourceRuleId || 'DOMAIN-EVIDENCE',
          category: `Life Domain: ${domainUpper}`,
          domain: domainUpper,
          direction: 'CHALLENGING',
          title: item.description?.substring(0, 60) || `${domainUpper} Challenging Factor`,
          description: item.description || '',
          weight: item.weight || 0.8,
          whyEvidence: item.whyEvidence || [item.description || 'Challenging domain indicator'],
        });
      }
    }
  }

  return items;
}
