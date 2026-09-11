import { PlanetName } from '@vedica/astrology-core';
import { LifeDomain, TransitEvidence } from '../types.js';

export function createTransitEvidence(
  id: string,
  planet: PlanetName,
  domain: LifeDomain,
  direction: 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL',
  weight: number,
  sourceRuleId: string,
  description: string,
  whyEvidence: string[]
): TransitEvidence {
  return {
    id,
    planet,
    domain,
    direction,
    weight,
    sourceRuleId,
    description,
    whyEvidence,
  };
}
