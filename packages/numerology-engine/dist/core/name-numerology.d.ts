import { PersonalNumerologyProfile, NameNumerologyResult, NameAnalysisOutput } from '../types/name-numerology.js';
import { NumerologyOptions } from '../types/numerology.js';
export declare const PERSONAL_NUMEROLOGY_V1: PersonalNumerologyProfile;
/**
 * Normalizes input name string:
 * Converts to uppercase and strips spaces, hyphens, apostrophes, periods, and non-alphabetic characters.
 */
export declare function normalizeName(name: string): string;
/**
 * Checks if a character is a vowel based on profile configuration.
 */
export declare function isVowel(char: string, profile?: PersonalNumerologyProfile): boolean;
/**
 * Calculates Expression / Destiny Number from full name.
 */
export declare function calculateExpressionNumber(normalizedName: string, profile?: PersonalNumerologyProfile, options?: NumerologyOptions): NameNumerologyResult;
/**
 * Calculates Soul Urge Number from vowels in full name.
 */
export declare function calculateSoulUrgeNumber(normalizedName: string, profile?: PersonalNumerologyProfile, options?: NumerologyOptions): NameNumerologyResult;
/**
 * Calculates Personality Number from consonants in full name.
 */
export declare function calculatePersonalityNumber(normalizedName: string, profile?: PersonalNumerologyProfile, options?: NumerologyOptions): NameNumerologyResult;
/**
 * Performs complete name-based numerology analysis for full name.
 */
export declare function analyzeNameNumerology(fullName: string, profile?: PersonalNumerologyProfile, options?: NumerologyOptions): NameAnalysisOutput | null;
//# sourceMappingURL=name-numerology.d.ts.map