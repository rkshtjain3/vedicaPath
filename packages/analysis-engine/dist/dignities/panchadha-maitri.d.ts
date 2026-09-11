import { PlanetFact } from '../types/analysis-types.js';
export type PanchadhaRelationship = 'ADHI_MITRA' | 'MITRA' | 'SAMA' | 'SHATRU' | 'ADHI_SHATRU';
/**
 * Calculates Tatkalika Maitri (Temporary Friendship).
 * Planets in 2, 3, 4, 10, 11, 12 houses from a given planet are Temporary Friends.
 * Planets in 1, 5, 6, 7, 8, 9 houses are Temporary Enemies.
 */
export declare function getTatkalikaRelationship(basePlanetFact: PlanetFact, targetPlanetFact: PlanetFact): 'FRIEND' | 'ENEMY';
/**
 * Calculates Panchadha Maitri (5-fold relationship) combining Natural and Temporary friendships.
 */
export declare function getPanchadhaMaitri(basePlanetFact: PlanetFact, targetPlanetFact: PlanetFact): PanchadhaRelationship;
