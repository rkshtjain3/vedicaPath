import { describe, expect, it } from 'vitest';
import { executeQueryEngine } from '../src/index.js';
import { normalizeQuestion } from '../src/question/question-normalizer.js';
import { extractEntities } from '../src/question/entity-extractor.js';
import { classifyIntent } from '../src/question/intent-classifier.js';
import { generateQueryFingerprint } from '../src/reproducibility/query-fingerprint.js';

const MOCK_CALCULATION_DATA = {
  reproducibilityHash: 'HASH-1234567890ABCDEF',
  fullName: 'Rakshit Jain',
  astrology: {
    ascendant: { longitude: 45.5, sign: { name: 'Taurus', sanskritName: 'Vrishabha', ruler: 'Venus' } },
    planets: [
      { planet: 'Sun', house: 1, sign: { name: 'Taurus' }, dignity: 'OWN_SIGN' },
      { planet: 'Saturn', house: 10, sign: { name: 'Aquarius' }, dignity: 'OWN_SIGN' },
      { planet: 'Jupiter', house: 9, sign: { name: 'Capricorn' }, dignity: 'DEBILITATED' },
    ],
  },
  lifeDomainAnalysis: {
    CAREER: {
      supportingFactors: [
        { id: 'CAREER-SUP-1', description: 'Saturn placed in 10th house in Aquarius', weight: 1.0 },
      ],
      challengingFactors: [
        { id: 'CAREER-CHAL-1', description: 'Jupiter debilitated in 9th house', weight: 0.8 },
      ],
    },
  },
  dasha: {
    current: {
      mahadasha: { lord: 'Saturn', startDate: '2020-01-01', endDate: '2039-01-01' },
      antardasha: { lord: 'Mercury', startDate: '2023-01-01', endDate: '2025-08-01' },
    },
  },
  transitAnalysis: {
    transits: [
      { planet: 'Saturn', houseFromLagna: 10, currentSign: { name: 'Aquarius' }, retrograde: false },
    ],
  },
  shadbala: {
    planets: [
      { planet: 'Saturn', totalRupa: 7.2, requiredRupa: 5.0, ratio: 1.44, isStrong: true },
      { planet: 'Sun', totalRupa: 6.5, requiredRupa: 6.5, ratio: 1.0, isStrong: true },
    ],
  },
  yogaAnalysis: {
    detectedYogas: [
      { id: 'SASA-YOGA', name: 'Sasa Mahapurusha Yoga', involvedPlanets: ['Saturn'], category: 'MAHAPURUSHA' },
    ],
  },
  numerology: {
    lifePath: { number: 7, meaning: 'Analytical and spiritual path' },
    birthday: { number: 15 },
    nameAnalysis: {
      expression: { number: 3 },
      soulUrge: { number: 9 },
    },
  },
};

describe('@vedica/query-engine', () => {
  it('normalizes questions deterministically', () => {
    const raw = '  What does MY chart say about   CAREER???  ';
    expect(normalizeQuestion(raw)).toBe('what does my chart say about career');
  });

  it('extracts domain and Sanskrit planet aliases', () => {
    const entShani = extractEntities('Tell me about Shani Dev');
    expect(entShani.planet).toBe('Saturn');

    const entGuru = extractEntities('How is Guru in my chart?');
    expect(entGuru.planet).toBe('Jupiter');

    const entCareer = extractEntities('What does my chart show about my career and job?');
    expect(entCareer.domain).toBe('CAREER');
  });

  it('classifies intents accurately with parser evidence', () => {
    const ent = extractEntities('What is the strength of Shani?');
    const intent = classifyIntent(ent);
    expect(intent.category).toBe('PLANET');
    expect(intent.planet).toBe('Saturn');
    expect(intent.confidence).toBe('HIGH');
  });

  it('detects predictive questions and injects non-predictive disclaimer', () => {
    const response = executeQueryEngine(MOCK_CALCULATION_DATA, 'Will I become a billionaire?');
    expect(response.query.isPredictiveAttempt).toBe(true);
    expect(response.query.predictiveDisclaimer).toContain('Vedica does not provide deterministic guarantees');
  });

  it('enforces Name Astrology Isolation in query fingerprinting', () => {
    const fpWithoutNameReq = generateQueryFingerprint({
      normalizedQuestion: 'what does my chart say about career',
      profileVersion: 'personal-query-v1',
      isNumerologyExplicit: false,
      fullName: 'Rakshit Jain',
    });

    const fpNoName = generateQueryFingerprint({
      normalizedQuestion: 'what does my chart say about career',
      profileVersion: 'personal-query-v1',
      isNumerologyExplicit: false,
      fullName: undefined,
    });

    // For non-numerology queries, fingerprint MUST be identical regardless of fullName
    expect(fpWithoutNameReq).toBe(fpNoName);
  });

  it('retrieves evidence across multiple engines for career query', () => {
    const response = executeQueryEngine(MOCK_CALCULATION_DATA, 'What does my chart show about career?');
    expect(response.query.status).toBe('ANSWERED');
    expect(response.query.intent.domain).toBe('CAREER');
    expect(response.query.evidenceGroups.length).toBeGreaterThan(0);
    expect(response.query.mixedSignals.detected).toBe(true);
    expect(response.query.whyEvidence.length).toBeGreaterThan(0);
  });

  it('retrieves birth date numerology without requiring full name', () => {
    const response = executeQueryEngine(MOCK_CALCULATION_DATA, 'Show my numerology numbers');
    expect(response.query.intent.category).toBe('NUMEROLOGY');
    expect(response.query.status).toBe('ANSWERED');
    const lifePathItem = response.query.evidenceGroups
      .flatMap((g) => g.evidence)
      .find((e) => e.id === 'NUMEROLOGY-LIFE-PATH');
    expect(lifePathItem).toBeDefined();
    expect(lifePathItem?.title).toContain('Life Path Number: 7');
  });
});
