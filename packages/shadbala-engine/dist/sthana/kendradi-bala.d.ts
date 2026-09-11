import { PlanetName } from '@vedica/astrology-core';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
export type HousePlacementCategory = 'KENDRA' | 'PANAPHARA' | 'APOKLIMA';
export declare const KENDRADI_BALA_VIRUPAS_MAP: Record<HousePlacementCategory, number>;
export declare function getHousePlacementCategory(house: number): HousePlacementCategory;
/**
 * Calculates Kendradi Bala (Strength based on house type).
 *
 * Kendra Houses (1, 4, 7, 10)     = 60 Virupas (1.0 Rupa)
 * Panaphara Houses (2, 5, 8, 11)  = 30 Virupas (0.5 Rupa)
 * Apoklima Houses (3, 6, 9, 12)   = 15 Virupas (0.25 Rupa)
 */
export declare function calculateKendradiBala(planet: PlanetName, house: number): SthanaBalaSubcomponent;
