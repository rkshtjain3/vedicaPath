import { PlanetName } from '@vedica/astrology-core';
import { ConjunctionResultInput, HouseLordFactInput, PlanetFactInput, VedicAspectInput } from '../types/yoga-types.js';
import { areConjunct } from './conjunction-helpers.js';
import { planetAspectsPlanet, areMutualAspecting } from './aspect-helpers.js';
import { isParivartana } from './lordship-helpers.js';

export interface RelationshipResult {
  associated: boolean;
  type?: 'CONJUNCTION' | 'MUTUAL_ASPECT' | 'DIRECT_ASPECT' | 'PARIVARTANA';
  details: string;
}

export function evaluatePlanetRelationship(
  planetA: PlanetName,
  planetB: PlanetName,
  houseA: number,
  houseB: number,
  planetFacts: PlanetFactInput[],
  conjunctions: ConjunctionResultInput[],
  aspects: VedicAspectInput[],
  houseLordFacts: HouseLordFactInput[]
): RelationshipResult {
  // 1. Check Parivartana (Exchange of signs)
  if (isParivartana(houseA, houseB, houseLordFacts)) {
    return {
      associated: true,
      type: 'PARIVARTANA',
      details: `${planetA} (Lord of ${houseA}) and ${planetB} (Lord of ${houseB}) are in Sign Exchange (Parivartana).`,
    };
  }

  // 2. Check Conjunction
  const conj = areConjunct(planetA, planetB, planetFacts, conjunctions);
  if (conj.conjunct) {
    return {
      associated: true,
      type: 'CONJUNCTION',
      details: conj.details,
    };
  }

  // 3. Check Mutual Aspect
  if (areMutualAspecting(planetA, planetB, planetFacts, aspects)) {
    return {
      associated: true,
      type: 'MUTUAL_ASPECT',
      details: `${planetA} and ${planetB} cast mutual Vedic aspects on each other.`,
    };
  }

  // 4. Check Direct Aspect
  const aAspectsB = planetAspectsPlanet(planetA, planetB, planetFacts, aspects);
  const bAspectsA = planetAspectsPlanet(planetB, planetA, planetFacts, aspects);
  if (aAspectsB || bAspectsA) {
    const actor = aAspectsB ? planetA : planetB;
    const target = aAspectsB ? planetB : planetA;
    return {
      associated: true,
      type: 'DIRECT_ASPECT',
      details: `${actor} casts a Vedic aspect on ${target}.`,
    };
  }

  return {
    associated: false,
    details: `${planetA} (Lord of ${houseA}) and ${planetB} (Lord of ${houseB}) have no direct association.`,
  };
}
