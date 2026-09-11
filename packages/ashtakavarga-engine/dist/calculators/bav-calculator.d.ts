import { BirthChart, RashiDetails } from '@vedica/astrology-core';
import { AshtakavargaPlanet, AshtakavargaContributor, BhinnaAshtakavarga } from '../types/ashtakavarga-types.js';
export declare const ASHTAKAVARGA_PLANETS: AshtakavargaPlanet[];
export declare const ASHTAKAVARGA_CONTRIBUTORS: AshtakavargaContributor[];
/**
 * Extracts contributor sign placements from a D1 BirthChart.
 */
export declare function extractContributorPlacements(chart: BirthChart): Record<AshtakavargaContributor, RashiDetails>;
/**
 * Calculates Bhinna Ashtakavarga (BAV) for a single target planet across all 12 signs.
 */
export declare function calculateBAVForPlanet(targetPlanet: AshtakavargaPlanet, placements: Record<AshtakavargaContributor, RashiDetails>): BhinnaAshtakavarga;
/**
 * Calculates complete Bhinna Ashtakavarga (BAV) for all 7 planets.
 */
export declare function calculateAllBAVs(chart: BirthChart): Record<AshtakavargaPlanet, BhinnaAshtakavarga>;
