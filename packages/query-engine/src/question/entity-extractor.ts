import { DirectionFilter, LifeDomain, PlanetName, QueryParserEvidence } from '../types.js';
import { PERSONAL_QUERY_V1, QueryProfile } from '../profile.js';
import { normalizeQuestion } from './question-normalizer.js';

export interface ExtractedEntities {
  domain?: LifeDomain;
  planet?: PlanetName;
  isTiming: boolean;
  isYoga: boolean;
  isStrength: boolean;
  isTransit: boolean;
  isNumerology: boolean;
  isPredictive: boolean;
  directionFilter?: DirectionFilter;
  parserEvidence: QueryParserEvidence[];
}

export function extractEntities(
  rawQuestion: string,
  profile: QueryProfile = PERSONAL_QUERY_V1
): ExtractedEntities {
  const normalized = normalizeQuestion(rawQuestion);
  const parserEvidence: QueryParserEvidence[] = [];

  let domain: LifeDomain | undefined;
  let planet: PlanetName | undefined;
  let isTiming = false;
  let isYoga = false;
  let isStrength = false;
  let isTransit = false;
  let isNumerology = false;
  let isPredictive = false;
  let directionFilter: DirectionFilter | undefined;

  // 1. Check Predictive Keywords
  for (const kw of profile.predictiveKeywords) {
    if (normalized.includes(kw)) {
      isPredictive = true;
      parserEvidence.push({
        matchedTerm: kw,
        mappedEntity: 'PREDICTIVE_QUESTION_ATTEMPT',
        entityType: 'FILTER',
      });
      break;
    }
  }

  // 2. Check Life Domains
  for (const [dom, keywords] of Object.entries(profile.domainKeywords) as [LifeDomain, string[]][]) {
    for (const kw of keywords) {
      if (!kw) continue;
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(normalized)) {
        domain = dom;
        parserEvidence.push({
          matchedTerm: kw,
          mappedEntity: dom,
          entityType: 'DOMAIN',
        });
        break;
      }
    }
    if (domain) break;
  }

  // 3. Check Planets & Sanskrit Aliases
  for (const [pName, aliases] of Object.entries(profile.planetAliases) as [PlanetName, string[]][]) {
    for (const alias of aliases) {
      if (!alias) continue;
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(normalized)) {
        planet = pName;
        parserEvidence.push({
          matchedTerm: alias,
          mappedEntity: pName,
          entityType: 'PLANET',
        });
        break;
      }
    }
    if (planet) break;
  }

  // 4. Check Timing Keywords
  for (const kw of profile.timingKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(normalized)) {
      isTiming = true;
      parserEvidence.push({
        matchedTerm: kw,
        mappedEntity: 'TIMING',
        entityType: 'TIMING',
      });
      break;
    }
  }

  // 5. Check Yoga Keywords
  for (const kw of profile.yogaKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(normalized)) {
      isYoga = true;
      parserEvidence.push({
        matchedTerm: kw,
        mappedEntity: 'YOGA',
        entityType: 'YOGA',
      });
      break;
    }
  }

  // 6. Check Strength / Shadbala Keywords
  for (const kw of profile.strengthKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(normalized)) {
      isStrength = true;
      parserEvidence.push({
        matchedTerm: kw,
        mappedEntity: 'STRENGTH',
        entityType: 'STRENGTH',
      });
      break;
    }
  }

  // 7. Check Transit Keywords
  for (const kw of profile.transitKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(normalized)) {
      isTransit = true;
      parserEvidence.push({
        matchedTerm: kw,
        mappedEntity: 'TRANSIT',
        entityType: 'TRANSIT',
      });
      break;
    }
  }

  // 8. Check Numerology Keywords
  for (const kw of profile.numerologyKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(normalized)) {
      isNumerology = true;
      parserEvidence.push({
        matchedTerm: kw,
        mappedEntity: 'NUMEROLOGY',
        entityType: 'NUMEROLOGY',
      });
      break;
    }
  }

  // 9. Direction Filters
  for (const kw of profile.filterKeywords.supportive) {
    if (normalized.includes(kw)) {
      directionFilter = 'SUPPORTIVE';
      parserEvidence.push({ matchedTerm: kw, mappedEntity: 'SUPPORTIVE', entityType: 'FILTER' });
      break;
    }
  }
  if (!directionFilter) {
    for (const kw of profile.filterKeywords.challenging) {
      if (normalized.includes(kw)) {
        directionFilter = 'CHALLENGING';
        parserEvidence.push({ matchedTerm: kw, mappedEntity: 'CHALLENGING', entityType: 'FILTER' });
        break;
      }
    }
  }
  if (!directionFilter) {
    for (const kw of profile.filterKeywords.mixed) {
      if (normalized.includes(kw)) {
        directionFilter = 'MIXED';
        parserEvidence.push({ matchedTerm: kw, mappedEntity: 'MIXED', entityType: 'FILTER' });
        break;
      }
    }
  }

  return {
    domain,
    planet,
    isTiming,
    isYoga,
    isStrength,
    isTransit,
    isNumerology,
    isPredictive,
    directionFilter,
    parserEvidence,
  };
}
