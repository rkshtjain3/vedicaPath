import { PlanetName } from '@vedica/astrology-core';
import { PlanetFact } from '../types/analysis-types.js';
import { getLordRelationship } from './dignity-engine.js';

export type PanchadhaRelationship =
  | 'ADHI_MITRA' // Great Friend
  | 'MITRA'      // Friend
  | 'SAMA'       // Neutral
  | 'SHATRU'     // Enemy
  | 'ADHI_SHATRU'; // Great Enemy

/**
 * Calculates Tatkalika Maitri (Temporary Friendship).
 * Planets in 2, 3, 4, 10, 11, 12 houses from a given planet are Temporary Friends.
 * Planets in 1, 5, 6, 7, 8, 9 houses are Temporary Enemies.
 */
export function getTatkalikaRelationship(
  basePlanetFact: PlanetFact,
  targetPlanetFact: PlanetFact
): 'FRIEND' | 'ENEMY' {
  // House distance is (target_house - base_house + 12) % 12
  // But wait, the standard definition is based on signs, not houses, but since D1 uses whole sign houses, it's the same.
  const distance = ((targetPlanetFact.house - basePlanetFact.house + 12) % 12) + 1;
  
  if ([2, 3, 4, 10, 11, 12].includes(distance)) {
    return 'FRIEND';
  }
  return 'ENEMY';
}

/**
 * Calculates Panchadha Maitri (5-fold relationship) combining Natural and Temporary friendships.
 */
export function getPanchadhaMaitri(
  basePlanetFact: PlanetFact,
  targetPlanetFact: PlanetFact
): PanchadhaRelationship {
  const naturalRel = getLordRelationship(basePlanetFact.planet, targetPlanetFact.planet); // 'FRIENDLY' | 'NEUTRAL' | 'ENEMY'
  const temporaryRel = getTatkalikaRelationship(basePlanetFact, targetPlanetFact); // 'FRIEND' | 'ENEMY'

  if (naturalRel === 'FRIENDLY') {
    return temporaryRel === 'FRIEND' ? 'ADHI_MITRA' : 'SAMA'; // Friend + Friend = Great Friend, Friend + Enemy = Neutral
  } else if (naturalRel === 'NEUTRAL') {
    return temporaryRel === 'FRIEND' ? 'MITRA' : 'SHATRU'; // Neutral + Friend = Friend, Neutral + Enemy = Enemy
  } else {
    // ENEMY
    return temporaryRel === 'FRIEND' ? 'SAMA' : 'ADHI_SHATRU'; // Enemy + Friend = Neutral, Enemy + Enemy = Great Enemy
  }
}
