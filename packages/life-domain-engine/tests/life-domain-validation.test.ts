import { describe, it, expect } from 'vitest';
import { evaluateLifeDomainEngine, PERSONAL_LIFE_DOMAIN_V1 } from '../src/index.js';

describe('Life Domain Engine Reproducibility & Non-AI Rules Validation', () => {
  const sampleInput = {
    astrology: {
      planets: [
        { planet: 'Sun', sign: { name: 'Leo' }, house: 1, dignity: 'OWN_SIGN' },
        { planet: 'Moon', sign: { name: 'Taurus' }, house: 10, dignity: 'EXALTED' },
        { planet: 'Mars', sign: { name: 'Aries' }, house: 9, dignity: 'OWN_SIGN' },
        { planet: 'Mercury', sign: { name: 'Virgo' }, house: 2, dignity: 'EXALTED' },
        { planet: 'Jupiter', sign: { name: 'Cancer' }, house: 12, dignity: 'EXALTED' },
        { planet: 'Venus', sign: { name: 'Pisces' }, house: 8, dignity: 'EXALTED' },
        { planet: 'Saturn', sign: { name: 'Libra' }, house: 3, dignity: 'EXALTED' },
      ],
    },
    analysis: {
      houseLordFacts: [
        { house: 1, lord: 'Sun', lordHouse: 1, dignity: 'OWN_SIGN' },
        { house: 2, lord: 'Mercury', lordHouse: 2, dignity: 'EXALTED' },
        { house: 10, lord: 'Venus', lordHouse: 8, dignity: 'EXALTED' },
        { house: 7, lord: 'Saturn', lordHouse: 3, dignity: 'EXALTED' },
      ],
      houseFacts: [
        { house: 1, planets: ['Sun'], sign: { name: 'Leo' } },
        { house: 10, planets: ['Moon'], sign: { name: 'Taurus' } },
        { house: 2, planets: ['Mercury'], sign: { name: 'Virgo' } },
        { house: 8, planets: ['Venus'], sign: { name: 'Pisces' } },
      ],
    },
    divisionalCharts: {
      d9Analysis: { ascendantSign: 'Taurus', ascendantLord: 'Venus' },
      d10Analysis: { ascendantSign: 'Leo', ascendantLord: 'Sun' },
    },
    strengthAnalysis: {
      planets: [
        { planet: 'Sun', score: 1.6, overallStrength: 'STRONG' },
        { planet: 'Moon', score: 1.8, overallStrength: 'EXCELLENT' },
      ],
    },
    shadbala: {
      planets: [
        { planet: 'Sun', isStrong: true, ratio: 1.5, totalRupa: 7.5 },
        { planet: 'Moon', isStrong: true, ratio: 1.7, totalRupa: 8.5 },
        { planet: 'Saturn', isStrong: true, ratio: 1.4, totalRupa: 7.0 },
        { planet: 'Jupiter', isStrong: true, ratio: 1.6, totalRupa: 8.0 },
        { planet: 'Venus', isStrong: true, ratio: 1.5, totalRupa: 7.5 },
      ],
    },
    ashtakavarga: {
      sav: { 2: 35, 11: 32, 9: 31, 10: 30 },
    },
    yogaAnalysis: {
      yogas: [
        { name: 'Raja Yoga', category: 'Rajayoga', description: 'Prominence and authority' },
        { name: 'Dhana Yoga', category: 'Dhanayoga', description: 'Financial prosperity' },
      ],
    },
    rules: {
      careerD10: [{ ruleId: 'CAREER_D10_EXALTED', triggered: true, explanationKey: 'Sun in Lagna' }],
    },
    dasha: {
      current: {
        mahadasha: { lord: 'Sun' },
        antardasha: { lord: 'Moon' },
      },
    },
    timing: {
      transits: {
        planets: [
          { planet: 'Jupiter', houseFromLagna: 10, currentSign: { name: 'Taurus' } },
        ],
      },
    },
  };

  it('produces identical output for identical input across 10 executions', () => {
    const baseline = evaluateLifeDomainEngine(sampleInput);
    for (let i = 0; i < 10; i++) {
      const current = evaluateLifeDomainEngine(sampleInput);
      expect(current.audit.hashKey).toBe(baseline.audit.hashKey);
      expect(current.summary).toEqual(baseline.summary);
      expect(current.domains.CAREER.scoring).toEqual(baseline.domains.CAREER.scoring);
    }
  });

  it('never outputs AI prediction terms or ungrounded guaranteed outcomes', () => {
    const output = evaluateLifeDomainEngine(sampleInput);
    const jsonString = JSON.stringify(output).toLowerCase();

    expect(jsonString).not.toContain('guaranteed job');
    expect(jsonString).not.toContain('will marry on');
    expect(jsonString).not.toContain('diagnosed with');
    expect(jsonString).not.toContain('ai generated');
  });

  it('preserves non-empty rule evidence list', () => {
    const output = evaluateLifeDomainEngine(sampleInput);
    expect(output.evaluatedRuleIds.length).toBeGreaterThan(0);
  });
});
