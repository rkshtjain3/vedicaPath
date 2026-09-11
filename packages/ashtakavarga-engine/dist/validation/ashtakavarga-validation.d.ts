import { AshtakavargaPlanet, BhinnaAshtakavarga, Sarvashtakavarga, AshtakavargaValidation } from '../types/ashtakavarga-types.js';
export declare const CANONICAL_EXPECTED_BAV_TOTALS: Record<AshtakavargaPlanet, number>;
/**
 * Validates BAV row sums and SAV total.
 */
export declare function validateAshtakavarga(bavMap: Record<AshtakavargaPlanet, BhinnaAshtakavarga>, sav: Sarvashtakavarga): AshtakavargaValidation;
