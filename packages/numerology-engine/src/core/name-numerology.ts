import { reduceNumber } from './reduction.js';
import {
  PersonalNumerologyProfile,
  LetterValueBreakdown,
  NameNumerologyResult,
  NameAnalysisOutput,
} from '../types/name-numerology.js';
import { NumerologyOptions } from '../types/numerology.js';

export const PERSONAL_NUMEROLOGY_V1: PersonalNumerologyProfile = {
  version: 'personal-numerology-v1',
  system: 'PYTHAGOREAN',
  yHandling: 'CONSONANT',
};

// Pythagorean letter values mapping
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

/**
 * Normalizes input name string:
 * Converts to uppercase and strips spaces, hyphens, apostrophes, periods, and non-alphabetic characters.
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  return name.toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Checks if a character is a vowel based on profile configuration.
 */
export function isVowel(char: string, profile: PersonalNumerologyProfile = PERSONAL_NUMEROLOGY_V1): boolean {
  const upperChar = char.toUpperCase();
  if (upperChar === 'Y') {
    return profile.yHandling === 'VOWEL';
  }
  return VOWELS.has(upperChar);
}

/**
 * Calculates Expression / Destiny Number from full name.
 */
export function calculateExpressionNumber(
  normalizedName: string,
  profile: PersonalNumerologyProfile = PERSONAL_NUMEROLOGY_V1,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NameNumerologyResult {
  const breakdown: LetterValueBreakdown[] = [];
  let rawSum = 0;

  for (const char of normalizedName) {
    const val = PYTHAGOREAN_MAP[char];
    if (val !== undefined) {
      const type = isVowel(char, profile) ? 'VOWEL' : 'CONSONANT';
      breakdown.push({ letter: char, value: val, type });
      rawSum += val;
    }
  }

  const reduction = reduceNumber(rawSum, options);

  const formulaSteps = [
    {
      stepNumber: 1,
      description: `Letter breakdown and raw sum of all letters in "${normalizedName}"`,
      expression: breakdown.map((b) => `${b.letter}(${b.value})`).join(' + ') + ` = ${rawSum}`,
      result: rawSum,
    },
    ...reduction.steps.map((s, i) => ({ ...s, stepNumber: i + 2 })),
  ];

  return {
    title: 'Expression Number (Destiny Number)',
    inputValues: { normalizedName, nameLength: normalizedName.length },
    rawSum,
    letterBreakdown: breakdown,
    includedLetters: breakdown.map((b) => b.letter),
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Soul Urge Number from vowels in full name.
 */
export function calculateSoulUrgeNumber(
  normalizedName: string,
  profile: PersonalNumerologyProfile = PERSONAL_NUMEROLOGY_V1,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NameNumerologyResult {
  const breakdown: LetterValueBreakdown[] = [];
  const includedLetters: string[] = [];
  const excludedLetters: string[] = [];
  let rawSum = 0;

  for (const char of normalizedName) {
    const val = PYTHAGOREAN_MAP[char];
    if (val !== undefined) {
      if (isVowel(char, profile)) {
        breakdown.push({ letter: char, value: val, type: 'VOWEL' });
        includedLetters.push(char);
        rawSum += val;
      } else {
        excludedLetters.push(char);
      }
    }
  }

  const reduction = reduceNumber(rawSum, options);

  const formulaSteps = [
    {
      stepNumber: 1,
      description: `Sum of vowels (${profile.yHandling === 'VOWEL' ? 'A, E, I, O, U, Y' : 'A, E, I, O, U'}) in "${normalizedName}"`,
      expression: breakdown.length > 0
        ? breakdown.map((b) => `${b.letter}(${b.value})`).join(' + ') + ` = ${rawSum}`
        : '0 = 0',
      result: rawSum,
    },
    ...reduction.steps.map((s, i) => ({ ...s, stepNumber: i + 2 })),
  ];

  return {
    title: 'Soul Urge Number (Heart\'s Desire)',
    inputValues: { normalizedName, vowelCount: includedLetters.length },
    rawSum,
    letterBreakdown: breakdown,
    includedLetters,
    excludedLetters,
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Personality Number from consonants in full name.
 */
export function calculatePersonalityNumber(
  normalizedName: string,
  profile: PersonalNumerologyProfile = PERSONAL_NUMEROLOGY_V1,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NameNumerologyResult {
  const breakdown: LetterValueBreakdown[] = [];
  const includedLetters: string[] = [];
  const excludedLetters: string[] = [];
  let rawSum = 0;

  for (const char of normalizedName) {
    const val = PYTHAGOREAN_MAP[char];
    if (val !== undefined) {
      if (!isVowel(char, profile)) {
        breakdown.push({ letter: char, value: val, type: 'CONSONANT' });
        includedLetters.push(char);
        rawSum += val;
      } else {
        excludedLetters.push(char);
      }
    }
  }

  const reduction = reduceNumber(rawSum, options);

  const formulaSteps = [
    {
      stepNumber: 1,
      description: `Sum of consonants in "${normalizedName}"`,
      expression: breakdown.length > 0
        ? breakdown.map((b) => `${b.letter}(${b.value})`).join(' + ') + ` = ${rawSum}`
        : '0 = 0',
      result: rawSum,
    },
    ...reduction.steps.map((s, i) => ({ ...s, stepNumber: i + 2 })),
  ];

  return {
    title: 'Personality Number',
    inputValues: { normalizedName, consonantCount: includedLetters.length },
    rawSum,
    letterBreakdown: breakdown,
    includedLetters,
    excludedLetters,
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Performs complete name-based numerology analysis for full name.
 */
export function analyzeNameNumerology(
  fullName: string,
  profile: PersonalNumerologyProfile = PERSONAL_NUMEROLOGY_V1,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NameAnalysisOutput | null {
  if (!fullName || !fullName.trim()) {
    return null;
  }

  const normalizedName = normalizeName(fullName);
  if (!normalizedName) {
    return null;
  }

  const expressionNumber = calculateExpressionNumber(normalizedName, profile, options);
  const soulUrgeNumber = calculateSoulUrgeNumber(normalizedName, profile, options);
  const personalityNumber = calculatePersonalityNumber(normalizedName, profile, options);

  return {
    fullName,
    normalizedName,
    profileVersion: profile.version,
    system: profile.system,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
  };
}
