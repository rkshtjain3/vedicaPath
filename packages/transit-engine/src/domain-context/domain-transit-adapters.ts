import {
  DomainTransitEvidence,
  LifeDomain,
  TransitAspect,
  TransitConjunction,
  TransitHouseContext,
  TransitPosition,
} from '../types.js';
import { createTransitEvidence } from '../evidence/transit-evidence-builder.js';

export function evaluateDomainTransitEvidence(
  transits: TransitPosition[],
  aspects: TransitAspect[],
  conjunctions: TransitConjunction[],
  houseContexts: TransitHouseContext[]
): Record<LifeDomain, DomainTransitEvidence> {
  const domains: LifeDomain[] = [
    'CAREER',
    'WEALTH',
    'RELATIONSHIPS',
    'HEALTH',
    'EDUCATION',
    'PROPERTY',
    'SPIRITUALITY',
  ];

  const result: Record<LifeDomain, DomainTransitEvidence> = {
    CAREER: { domain: 'CAREER', evidence: [], supportiveCount: 0, challengingCount: 0, neutralCount: 0 },
    WEALTH: { domain: 'WEALTH', evidence: [], supportiveCount: 0, challengingCount: 0, neutralCount: 0 },
    RELATIONSHIPS: { domain: 'RELATIONSHIPS', evidence: [], supportiveCount: 0, challengingCount: 0, neutralCount: 0 },
    HEALTH: {
      domain: 'HEALTH',
      evidence: [],
      supportiveCount: 0,
      challengingCount: 0,
      neutralCount: 0,
      disclaimer: 'Astrological health context only. This does not constitute medical advice or diagnosis.',
    },
    EDUCATION: { domain: 'EDUCATION', evidence: [], supportiveCount: 0, challengingCount: 0, neutralCount: 0 },
    PROPERTY: { domain: 'PROPERTY', evidence: [], supportiveCount: 0, challengingCount: 0, neutralCount: 0 },
    SPIRITUALITY: { domain: 'SPIRITUALITY', evidence: [], supportiveCount: 0, challengingCount: 0, neutralCount: 0 },
  };

  const domainHouses: Record<LifeDomain, number[]> = {
    CAREER: [10, 6, 1],
    WEALTH: [2, 11, 5, 9],
    RELATIONSHIPS: [7, 5],
    HEALTH: [1, 6, 8, 12],
    EDUCATION: [4, 5, 9],
    PROPERTY: [4],
    SPIRITUALITY: [9, 12],
  };

  for (const dom of domains) {
    const relevantHouses = domainHouses[dom];
    const domEvidenceList = [];

    // House transits
    for (const hc of houseContexts) {
      if (relevantHouses.includes(hc.houseFromLagna)) {
        const direction = hc.classification === 'SUPPORTIVE_CONTEXT'
          ? 'SUPPORTIVE'
          : hc.classification === 'CHALLENGING_CONTEXT'
          ? 'CHALLENGING'
          : 'NEUTRAL';

        domEvidenceList.push(
          createTransitEvidence(
            `TR-HOUSE-${hc.planet}-${dom}`,
            hc.planet,
            dom,
            direction,
            1.0,
            `RULE-TR-HOUSE-${hc.houseFromLagna}`,
            `Transiting ${hc.planet} in natal house ${hc.houseFromLagna}`,
            hc.whyEvidence
          )
        );
      }
    }

    // Aspects
    for (const asp of aspects) {
      if (asp.natalTarget === 'Lagna' && relevantHouses.includes(asp.aspectHouseDistance)) {
        domEvidenceList.push(
          createTransitEvidence(
            `TR-ASP-${asp.transitingPlanet}-${dom}`,
            asp.transitingPlanet,
            dom,
            'SUPPORTIVE',
            0.8,
            `RULE-TR-ASP-${asp.aspectType}`,
            `Transiting ${asp.transitingPlanet} aspects natal house ${asp.aspectHouseDistance}`,
            asp.whyEvidence
          )
        );
      }
    }

    // Conjunctions
    for (const conj of conjunctions) {
      domEvidenceList.push(
        createTransitEvidence(
          `TR-CONJ-${conj.transitingPlanet}-${conj.natalPlanet}-${dom}`,
          conj.transitingPlanet,
          dom,
          'SUPPORTIVE',
          1.2,
          `RULE-TR-CONJ-${conj.transitingPlanet}-${conj.natalPlanet}`,
          `Transiting ${conj.transitingPlanet} conjunct natal ${conj.natalPlanet}`,
          conj.whyEvidence
        )
      );
    }

    const supportiveCount = domEvidenceList.filter((e) => e.direction === 'SUPPORTIVE').length;
    const challengingCount = domEvidenceList.filter((e) => e.direction === 'CHALLENGING').length;
    const neutralCount = domEvidenceList.filter((e) => e.direction === 'NEUTRAL').length;

    result[dom] = {
      domain: dom,
      evidence: domEvidenceList,
      supportiveCount,
      challengingCount,
      neutralCount,
      disclaimer: dom === 'HEALTH' ? 'Astrological health context only. This does not constitute medical advice or diagnosis.' : undefined,
    };
  }

  return result;
}
