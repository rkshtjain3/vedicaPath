import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Nathonata Bala (Diurnal / Nocturnal Strength) according to BPHS Chapter 27.
 *
 * Rules:
 * - Day Birth (Sun in Houses 7-12 / above horizon):
 *   Sun, Jupiter, Venus get 60 Virupas. Moon, Mars, Saturn get 0 Virupas. Mercury gets 60 Virupas.
 * - Night Birth (Sun in Houses 1-6 / below horizon):
 *   Moon, Mars, Saturn get 60 Virupas. Sun, Jupiter, Venus get 0 Virupas. Mercury gets 60 Virupas.
 */
export declare function calculateNathonataBala(planet: PlanetName, sunHouse: number): KaalaBalaSubcomponent;
