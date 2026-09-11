import { PlanetName } from '@vedica/astrology-core';
import { PlanetFactInput, VedicAspectInput } from '../types/yoga-types.js';

export function planetAspectsHouse(
  planet: PlanetName,
  targetHouse: number,
  aspects: VedicAspectInput[]
): boolean {
  return aspects.some(
    (a) => a.fromPlanet.toLowerCase() === planet.toLowerCase() && a.toHouse === targetHouse
  );
}

export function planetAspectsPlanet(
  fromPlanet: PlanetName,
  toPlanet: PlanetName,
  planetFacts: PlanetFactInput[],
  aspects: VedicAspectInput[]
): boolean {
  const targetFact = planetFacts.find((p) => p.planet.toLowerCase() === toPlanet.toLowerCase());
  if (!targetFact) return false;
  return planetAspectsHouse(fromPlanet, targetFact.house, aspects);
}

export function areMutualAspecting(
  planetA: PlanetName,
  planetB: PlanetName,
  planetFacts: PlanetFactInput[],
  aspects: VedicAspectInput[]
): boolean {
  const aAspectsB = planetAspectsPlanet(planetA, planetB, planetFacts, aspects);
  const bAspectsA = planetAspectsPlanet(planetB, planetA, planetFacts, aspects);
  return aAspectsB && bAspectsA;
}
