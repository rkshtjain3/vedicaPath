import { AshtakavargaPlanet, AshtakavargaContributor } from '../types/ashtakavarga-types.js';
export interface BinduRule {
    targetPlanet: AshtakavargaPlanet;
    source: AshtakavargaContributor;
    allowedRelativeHouses: number[];
}
/**
 * Canonical Parashari Bhinna Ashtakavarga (BAV) Rule Table.
 *
 * Defines allowed relative house positions (1-12) from each contributor
 * (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna)
 * for each target planet.
 *
 * Expected Planet Totals:
 * - SUN:     48 bindus
 * - MOON:    49 bindus
 * - MARS:    39 bindus
 * - MERCURY: 54 bindus
 * - JUPITER: 56 bindus
 * - VENUS:   52 bindus
 * - SATURN:  39 bindus
 * -------------------
 * Total SAV: 337 bindus
 */
export declare const CANONICAL_BINDU_RULES: Record<AshtakavargaPlanet, Record<AshtakavargaContributor, number[]>>;
/**
 * Helper to retrieve allowed relative houses for a given target planet and contributor.
 */
export declare function getAllowedRelativeHouses(targetPlanet: AshtakavargaPlanet, contributor: AshtakavargaContributor): number[];
