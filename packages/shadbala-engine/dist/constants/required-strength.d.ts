import { PlanetName } from '@vedica/astrology-core';
import { RequiredStrengthFact } from '../types/shadbala-types.js';
/**
 * Classical Minimum Required Shadbala Virupas (Pinda Bala requirement)
 * Source: Brihat Parasara Hora Shastra (BPHS)
 *
 * Sun: 390 Virupas (6.5 Rupas)
 * Moon: 360 Virupas (6.0 Rupas)
 * Mars: 300 Virupas (5.0 Rupas)
 * Mercury: 420 Virupas (7.0 Rupas)
 * Jupiter: 390 Virupas (6.5 Rupas)
 * Venus: 330 Virupas (5.5 Rupas)
 * Saturn: 300 Virupas (5.0 Rupas)
 */
export declare const REQUIRED_SHADBALA_VIRUPAS_MAP: Record<PlanetName, number>;
export declare function getRequiredStrengthFact(planet: PlanetName, isComplete?: boolean): RequiredStrengthFact;
