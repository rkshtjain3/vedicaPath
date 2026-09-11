import { PlanetName } from '@vedica/astrology-core';
import { HouseLordFactInput, PlanetFactInput } from '../types/yoga-types.js';

export function getLordOfHouse(
  houseNumber: number,
  houseLordFacts: HouseLordFactInput[]
): PlanetName | undefined {
  return houseLordFacts.find((h) => h.house === houseNumber)?.lord;
}

export function getHouseLordFact(
  houseNumber: number,
  houseLordFacts: HouseLordFactInput[]
): HouseLordFactInput | undefined {
  return houseLordFacts.find((h) => h.house === houseNumber);
}

export function getPlanetFact(
  planet: PlanetName,
  planetFacts: PlanetFactInput[]
): PlanetFactInput | undefined {
  return planetFacts.find((p) => p.planet.toLowerCase() === planet.toLowerCase());
}

export function isParivartana(
  houseA: number,
  houseB: number,
  houseLordFacts: HouseLordFactInput[]
): boolean {
  const factA = houseLordFacts.find((h) => h.house === houseA);
  const factB = houseLordFacts.find((h) => h.house === houseB);
  if (!factA || !factB) return false;
  return factA.lordHouse === houseB && factB.lordHouse === houseA;
}
