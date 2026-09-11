import { QueryEvidenceItem, QueryIntent } from '../types.js';
import { retrieveNatalEvidence } from './natal-retriever.js';
import { retrieveDashaEvidence } from './dasha-retriever.js';
import { retrieveTransitEvidence } from './transit-retriever.js';
import { retrieveAshtakavargaEvidence } from './ashtakavarga-retriever.js';
import { retrieveStrengthEvidence } from './strength-retriever.js';
import { retrieveShadbalaEvidence } from './shadbala-retriever.js';
import { retrieveYogaEvidence } from './yoga-retriever.js';
import { retrieveDivisionalEvidence } from './divisional-retriever.js';
import { retrieveLifeDomainEvidence } from './life-domain-retriever.js';
import { retrieveNumerologyEvidence } from './numerology-retriever.js';

export function retrieveEvidenceForIntent(
  calculationData: any,
  intent: QueryIntent,
  fullName?: string
): QueryEvidenceItem[] {
  const items: QueryEvidenceItem[] = [];

  const targetPlanet = intent.planet;
  const targetDomain = intent.domain;

  // 1. Life Domain Evidence
  if (intent.category === 'DOMAIN' || targetDomain || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveLifeDomainEvidence(calculationData, targetDomain, targetPlanet));
  }

  // 2. Natal Evidence
  if (intent.category === 'PLANET' || intent.category === 'DOMAIN' || intent.category === 'STRENGTH' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveNatalEvidence(calculationData, targetPlanet));
  }

  // 3. Divisional Chart Evidence
  if (intent.category === 'DOMAIN' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveDivisionalEvidence(calculationData, targetPlanet));
  }

  // 4. Dasha & Timeline Evidence
  if (intent.category === 'TIMING' || intent.category === 'DOMAIN' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveDashaEvidence(calculationData, targetPlanet));
  }

  // 5. Transit & Convergence Evidence
  if (intent.category === 'TRANSIT' || intent.category === 'TIMING' || intent.category === 'DOMAIN' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveTransitEvidence(calculationData, targetPlanet));
  }

  // 6. Ashtakavarga Evidence
  if (intent.category === 'TRANSIT' || intent.category === 'STRENGTH' || intent.category === 'DOMAIN' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveAshtakavargaEvidence(calculationData, targetPlanet));
  }

  // 7. Planetary Strength
  if (intent.category === 'STRENGTH' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveStrengthEvidence(calculationData, targetPlanet));
  }

  // 8. Shadbala Evidence
  if (intent.category === 'STRENGTH' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveShadbalaEvidence(calculationData, targetPlanet));
  }

  // 9. Classical Yogas
  if (intent.category === 'YOGA' || intent.category === 'DOMAIN' || intent.category === 'PLANET' || intent.category === 'EVIDENCE' || intent.category === 'UNKNOWN') {
    items.push(...retrieveYogaEvidence(calculationData, targetPlanet));
  }

  // 10. Numerology Evidence (Only when explicitly asked or during general evidence exploration)
  if (intent.category === 'NUMEROLOGY' || (intent.category === 'EVIDENCE' && !targetDomain && !targetPlanet)) {
    items.push(...retrieveNumerologyEvidence(calculationData, fullName));
  }

  // Filter by Direction if user specified
  if (intent.directionFilter && intent.directionFilter !== 'ALL' && intent.directionFilter !== 'MIXED') {
    return items.filter((i) => i.direction === intent.directionFilter);
  }

  return items;
}
