import { NumerologyCalculationResult } from './numerology.js';
export type NameNumerologySystem = 'PYTHAGOREAN' | 'CHALDEAN';
export type YHandlingPolicy = 'CONSONANT' | 'VOWEL';
export interface PersonalNumerologyProfile {
    version: string;
    system: NameNumerologySystem;
    yHandling: YHandlingPolicy;
}
export interface LetterValueBreakdown {
    letter: string;
    value: number;
    type: 'VOWEL' | 'CONSONANT';
}
export interface NameNumerologyResult extends NumerologyCalculationResult {
    rawSum: number;
    letterBreakdown: LetterValueBreakdown[];
    includedLetters: string[];
    excludedLetters?: string[];
}
export interface NameAnalysisOutput {
    fullName: string;
    normalizedName: string;
    profileVersion: string;
    system: NameNumerologySystem;
    expressionNumber: NameNumerologyResult;
    soulUrgeNumber: NameNumerologyResult;
    personalityNumber: NameNumerologyResult;
}
//# sourceMappingURL=name-numerology.d.ts.map