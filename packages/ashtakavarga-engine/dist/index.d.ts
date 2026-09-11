import { BirthChart } from '@vedica/astrology-core';
import { AshtakavargaResult, AshtakavargaProfile } from './types/ashtakavarga-types.js';
export * from './types/ashtakavarga-types.js';
export * from './profiles/ashtakavarga-profile.js';
export * from './rules/bindu-rules.js';
export * from './utils/relative-house.js';
export * from './calculators/bav-calculator.js';
export * from './calculators/sav-calculator.js';
export * from './calculators/shodhana-calculator.js';
export * from './validation/ashtakavarga-validation.js';
export * from './explain/ashtakavarga-explain.js';
/**
 * Main entry point for Ashtakavarga Engine.
 * Calculates Bhinna Ashtakavarga (BAV), Sarvashtakavarga (SAV),
 * classical Shodhanas (Trikona & Ekadhipatya), Shodhya Pinda, and performs canonical validation.
 *
 * @param chart D1 Natal BirthChart
 * @param profile Optional AshtakavargaProfile (defaults to PERSONAL_ASHTAKAVARGA_V1)
 * @returns AshtakavargaResult
 */
export declare function calculateAshtakavarga(chart: BirthChart, profile?: AshtakavargaProfile): AshtakavargaResult;
