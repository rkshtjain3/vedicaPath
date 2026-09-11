import { PlanetName } from '@vedica/astrology-core';
import { CheshtaBalaStatusComponent } from '../types/shadbala-types.js';
/**
 * Creates Foundation placeholder for Cheshta Bala (Motional Strength).
 *
 * Phase 13A Architecture:
 * Exposes retrograde status, speed metadata, and status FOUNDATION.
 * Assigns 0 Virupas and does NOT assign fake strength points.
 */
export declare function calculateCheshtaBalaFoundation(planet: PlanetName, isRetrograde?: boolean, speed?: number): CheshtaBalaStatusComponent;
