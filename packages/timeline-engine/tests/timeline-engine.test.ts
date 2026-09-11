import { describe, it, expect } from 'vitest';
import { evaluateTimelineEngine, PERSONAL_TIMELINE_V1 } from '../src/index.js';

describe('@vedica/timeline-engine', () => {
  const sampleInput = {
    astrology: {
      birthTime: { utcInstant: '1990-05-15T10:00:00.000Z' },
      planets: [
        { planet: 'Sun', longitude: 58.2, sign: { name: 'Taurus' }, house: 10, dignity: 'OWN_SIGN' },
        { planet: 'Moon', longitude: 212.5, sign: { name: 'Libra' }, house: 3, dignity: 'EXALTED' },
        { planet: 'Mars', longitude: 320.1, sign: { name: 'Aquarius' }, house: 7 },
        { planet: 'Mercury', longitude: 42.0, sign: { name: 'Taurus' }, house: 9 },
        { planet: 'Jupiter', longitude: 105.4, sign: { name: 'Cancer' }, house: 12, dignity: 'EXALTED' },
        { planet: 'Venus', longitude: 15.2, sign: { name: 'Aries' }, house: 9 },
        { planet: 'Saturn', longitude: 275.8, sign: { name: 'Capricorn' }, house: 6, dignity: 'OWN_SIGN' },
      ],
    },
    analysis: {
      houseLordFacts: [
        { house: 10, lord: 'Sun', lordHouse: 10, dignity: 'OWN_SIGN' },
        { house: 3, lord: 'Venus', lordHouse: 9 },
        { house: 7, lord: 'Saturn', lordHouse: 6 },
      ],
    },
    strengthAnalysis: {
      planets: [
        { planet: 'Sun', score: 1.5, overallStrength: 'STRONG' },
        { planet: 'Jupiter', score: 1.8, overallStrength: 'EXCELLENT' },
      ],
    },
    shadbala: {
      planets: [
        { planet: 'Sun', isStrong: true, ratio: 1.4, totalRupa: 7.0 },
        { planet: 'Jupiter', isStrong: true, ratio: 1.6, totalRupa: 8.0 },
      ],
    },
    yogaAnalysis: {
      yogas: [
        { name: 'Raja Yoga', category: 'Rajayoga', description: 'Sun in 10th house authority' },
      ],
    },
    ashtakavarga: {
      sav: { 10: 34, 7: 29, 6: 25 },
    },
    timing: {
      transits: {
        planets: [
          { planet: 'Jupiter', houseFromLagna: 10, currentSign: { name: 'Taurus' } },
          { planet: 'Saturn', houseFromLagna: 7, currentSign: { name: 'Aquarius' } },
        ],
      },
    },
    dasha: {
      mahadashas: [
        {
          level: 'MAHADASHA',
          lord: 'Jupiter',
          start: new Date('2020-01-01T00:00:00Z'),
          end: new Date('2036-01-01T00:00:00Z'),
          children: [
            {
              level: 'ANTARDASHA',
              lord: 'Saturn',
              parentLord: 'Jupiter',
              start: new Date('2025-01-01T00:00:00Z'),
              end: new Date('2027-06-01T00:00:00Z'),
              children: [
                {
                  level: 'PRATYANTARDASHA',
                  lord: 'Mercury',
                  parentLord: 'Saturn',
                  start: new Date('2026-05-01T00:00:00Z'),
                  end: new Date('2026-09-01T00:00:00Z'),
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const targetDate = new Date('2026-08-30T10:00:00.000Z');

  it('generates multi-level Dasha timeline with Mahadasha, Antardasha, and Pratyantardasha', () => {
    const result = evaluateTimelineEngine(sampleInput, { currentDate: targetDate });

    expect(result.profileVersion).toBe(PERSONAL_TIMELINE_V1);
    expect(result.timeline.length).toBeGreaterThan(0);
    expect(result.currentPeriod.mahadasha?.lord).toBe('JUPITER');
    expect(result.currentPeriod.antardasha?.lord).toBe('SATURN');
    expect(result.currentPeriod.pratyantardasha?.lord).toBe('MERCURY');
  });

  it('classifies timing windows without using predictive or guaranteed terms', () => {
    const result = evaluateTimelineEngine(sampleInput, { currentDate: targetDate });

    expect(result.timingWindows.length).toBeGreaterThan(0);
    const jsonStr = JSON.stringify(result).toLowerCase();
    expect(jsonStr).not.toContain('good_period');
    expect(jsonStr).not.toContain('bad_period');
    expect(jsonStr).not.toContain('success_period');
    expect(jsonStr).not.toContain('failure_period');
    expect(jsonStr).not.toContain('will marry');
    expect(jsonStr).not.toContain('guaranteed job');
  });

  it('evaluates confidence score and produces deterministic audit hash', () => {
    const result1 = evaluateTimelineEngine(sampleInput, { currentDate: targetDate });
    const result2 = evaluateTimelineEngine(sampleInput, { currentDate: targetDate });

    expect(result1.confidence.level).toBeDefined();
    expect(result1.audit.hashKey).toBe(result2.audit.hashKey);
  });
});
