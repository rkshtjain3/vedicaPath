import { describe, it, expect } from 'vitest';
import {
  normalizeName,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  analyzeNameNumerology,
  PERSONAL_NUMEROLOGY_V1,
} from '../src/index.js';

describe('Name-Based Numerology Engine (Pythagorean)', () => {
  it('normalizes names consistently by removing spaces, hyphens, punctuation, and non-alphabetic chars', () => {
    expect(normalizeName('Rakshit Jain')).toBe('RAKSHITJAIN');
    expect(normalizeName('RAKSHIT JAIN')).toBe('RAKSHITJAIN');
    expect(normalizeName('Rakshit-Jain')).toBe('RAKSHITJAIN');
    expect(normalizeName('Rakshit.Jain')).toBe('RAKSHITJAIN');
    expect(normalizeName("Rakshit O'Jain")).toBe('RAKSHITOJAIN');
  });

  it('calculates Expression Number correctly with step-by-step transparency for Rakshit Jain', () => {
    // RAKSHIT JAIN
    // R(9)+A(1)+K(2)+S(1)+H(8)+I(9)+T(2) + J(1)+A(1)+I(9)+N(5)
    // 9 + 1 + 2 + 1 + 8 + 9 + 2 + 1 + 1 + 9 + 5 = 48 -> 4+8 = 12 -> 1+2 = 3
    const res = calculateExpressionNumber('RAKSHITJAIN');
    expect(res.rawSum).toBe(48);
    expect(res.finalNumber).toBe(3);
    expect(res.isMasterNumber).toBe(false);
    expect(res.formulaSteps.length).toBeGreaterThanOrEqual(3);
    expect(res.letterBreakdown.length).toBe(11);
  });

  it('calculates Soul Urge Number correctly using vowels (A, E, I, O, U)', () => {
    // RAKSHIT JAIN -> Vowels: A(1), I(9), A(1), I(9) = 20 -> 2+0 = 2
    const res = calculateSoulUrgeNumber('RAKSHITJAIN');
    expect(res.rawSum).toBe(20);
    expect(res.finalNumber).toBe(2);
    expect(res.includedLetters).toEqual(['A', 'I', 'A', 'I']);
  });

  it('calculates Personality Number correctly using consonants', () => {
    // RAKSHIT JAIN -> Consonants: R(9), K(2), S(1), H(8), T(2), J(1), N(5) = 28 -> 2+8 = 10 -> 1+0 = 1
    const res = calculatePersonalityNumber('RAKSHITJAIN');
    expect(res.rawSum).toBe(28);
    expect(res.finalNumber).toBe(1);
    expect(res.includedLetters).toEqual(['R', 'K', 'S', 'H', 'T', 'J', 'N']);
  });

  it('preserves Master Numbers (11, 22, 33)', () => {
    // A(1) + J(1) + S(1) + B(2) + K(2) + T(2) + C(3) = 12
    // Let's create a string that sums to 11 e.g. "BKTC" -> B(2)+K(2)+T(2)+C(3)+B(2) = 11
    const res = calculateExpressionNumber('BKTCB');
    expect(res.rawSum).toBe(11);
    expect(res.finalNumber).toBe(11);
    expect(res.isMasterNumber).toBe(true);
  });

  it('returns null for empty or invalid names in analyzeNameNumerology', () => {
    expect(analyzeNameNumerology('')).toBeNull();
    expect(analyzeNameNumerology('   ')).toBeNull();
    expect(analyzeNameNumerology('123!@#')).toBeNull();
  });

  it('returns full analysis object when a valid name is provided', () => {
    const analysis = analyzeNameNumerology('Rakshit Jain');
    expect(analysis).not.toBeNull();
    expect(analysis?.fullName).toBe('Rakshit Jain');
    expect(analysis?.normalizedName).toBe('RAKSHITJAIN');
    expect(analysis?.profileVersion).toBe(PERSONAL_NUMEROLOGY_V1.version);
    expect(analysis?.expressionNumber.finalNumber).toBe(3);
    expect(analysis?.soulUrgeNumber.finalNumber).toBe(2);
    expect(analysis?.personalityNumber.finalNumber).toBe(1);
  });
});
