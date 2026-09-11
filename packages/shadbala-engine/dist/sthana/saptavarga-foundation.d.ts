import { PlanetName } from '@vedica/astrology-core';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
export interface SaptavargaStatus {
    status: 'PARTIAL';
    supportedVargas: string[];
    unsupportedVargas: string[];
}
export declare const SAPTAVARGA_STATUS_FOUNDATION: SaptavargaStatus;
/**
 * Foundation placeholder for Saptavargaja Bala.
 * Phase 13A explicitly declares PARTIAL status for D1 and D9 support.
 * Assigns 0 Virupas to avoid silent approximations.
 */
export declare function calculateSaptavargaFoundation(planet: PlanetName): SthanaBalaSubcomponent;
