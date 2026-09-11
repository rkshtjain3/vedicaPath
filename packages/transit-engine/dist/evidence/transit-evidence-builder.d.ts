import { PlanetName } from '@vedica/astrology-core';
import { LifeDomain, TransitEvidence } from '../types.js';
export declare function createTransitEvidence(id: string, planet: PlanetName, domain: LifeDomain, direction: 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL', weight: number, sourceRuleId: string, description: string, whyEvidence: string[]): TransitEvidence;
