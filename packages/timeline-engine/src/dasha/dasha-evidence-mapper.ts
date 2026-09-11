import { LordChartContext, LifeDomain, TimingEvidence } from '../types.js';
import { createTimingEvidence } from '../shared/evidence.js';

export function mapLordContextToTimingEvidence(
  periodId: string,
  lordContext: LordChartContext,
  engineData: any
): TimingEvidence[] {
  const evidenceList: TimingEvidence[] = [];
  const planet = lordContext.planet;
  const natal = lordContext.natalContext;
  const strength = lordContext.strengthContext;
  const yogas = lordContext.yogaContext;
  const div = lordContext.divisionalContext;
  const domains = lordContext.lifeDomainRelevance;

  // 1. Natal House & Dignity Evidence
  if (natal.house && natal.sign) {
    const isBeneficPlacement = natal.dignity === 'EXALTED' || natal.dignity === 'OWN_SIGN' || [1, 4, 5, 7, 9, 10].includes(natal.house);
    const primaryDomain: LifeDomain = domains[0] || 'CAREER';

    evidenceList.push(
      createTimingEvidence({
        id: `TIMING-${primaryDomain}-NATAL-${planet}-${natal.house}`,
        periodId,
        domain: primaryDomain,
        planet,
        sourceEngine: 'astrology-core',
        sourceRuleId: `NATAL_${planet.toUpperCase()}_H${natal.house}`,
        description: `Dasha lord ${planet} is placed in natal house ${natal.house} (${natal.sign}) with dignity ${natal.dignity || 'NEUTRAL'}.`,
        direction: isBeneficPlacement ? 'SUPPORTIVE' : 'CHALLENGING',
        strength: natal.dignity === 'EXALTED' || natal.dignity === 'OWN_SIGN' ? 'HIGH' : 'MEDIUM',
      })
    );
  }

  // 2. Strength & Shadbala Evidence
  if (strength.overallStrength || strength.isStrong !== undefined) {
    const isStrong = strength.isStrong || strength.overallStrength === 'STRONG' || strength.overallStrength === 'EXCELLENT';
    const primaryDomain: LifeDomain = domains[0] || 'CAREER';

    evidenceList.push(
      createTimingEvidence({
        id: `TIMING-${primaryDomain}-STRENGTH-${planet}`,
        periodId,
        domain: primaryDomain,
        planet,
        sourceEngine: 'strength-engine',
        sourceRuleId: `STRENGTH_${planet.toUpperCase()}`,
        description: `Dasha lord ${planet} planetary strength classification is ${strength.overallStrength || (isStrong ? 'STRONG' : 'CHALLENGING')}.`,
        direction: isStrong ? 'SUPPORTIVE' : 'CHALLENGING',
        strength: isStrong ? 'HIGH' : 'MEDIUM',
      })
    );
  }

  // 3. Classical Yogas Evidence
  for (const y of yogas) {
    const primaryDomain: LifeDomain = y.category?.toLowerCase().includes('dhana') ? 'WEALTH' : (y.category?.toLowerCase().includes('raja') ? 'CAREER' : (domains[0] || 'CAREER'));

    evidenceList.push(
      createTimingEvidence({
        id: `TIMING-${primaryDomain}-YOGA-${planet}-${y.name.replace(/\s+/g, '_')}`,
        periodId,
        domain: primaryDomain,
        planet,
        sourceEngine: 'yoga-engine',
        sourceRuleId: y.id || `YOGA_${y.name.toUpperCase().replace(/\s+/g, '_')}`,
        description: `Dasha lord ${planet} participates in classical Yoga: ${y.name}.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
      })
    );
  }

  // 4. Divisional Chart Evidence (D9 & D10)
  if (div.isVargottama) {
    const primaryDomain: LifeDomain = domains[0] || 'CAREER';
    evidenceList.push(
      createTimingEvidence({
        id: `TIMING-${primaryDomain}-VARGOTTAMA-${planet}`,
        periodId,
        domain: primaryDomain,
        planet,
        sourceEngine: 'divisional-chart-engine',
        sourceRuleId: `VARGOTTAMA_${planet.toUpperCase()}`,
        description: `Dasha lord ${planet} holds Vargottama status (identical sign placement in D1 and D9).`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
      })
    );
  }

  // 5. Life Domain Engine Evidence
  const lifeAnalysis = engineData.lifeDomainAnalysis;
  if (lifeAnalysis && lifeAnalysis.domains) {
    for (const domKey of domains) {
      const domObj = lifeAnalysis.domains[domKey];
      if (domObj && domObj.state && domObj.state !== 'INSUFFICIENT_EVIDENCE') {
        const dir = domObj.state.includes('SUPPORTIVE')
          ? 'SUPPORTIVE'
          : domObj.state.includes('CHALLENGING')
          ? 'CHALLENGING'
          : 'NEUTRAL';
        evidenceList.push(
          createTimingEvidence({
            id: `TIMING-${domKey}-LIFE-DOMAIN-${planet}`,
            periodId,
            domain: domKey,
            planet,
            sourceEngine: 'life-domain-engine',
            sourceRuleId: `LIFE_DOMAIN_${domKey}_${domObj.state}`,
            description: `Life domain synthesis for ${domObj.title} evaluates overall state as ${domObj.state}.`,
            direction: dir,
            strength: 'MEDIUM',
          })
        );
      }
    }
  }

  return evidenceList;
}
