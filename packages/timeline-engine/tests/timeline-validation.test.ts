import { describe, it, expect } from 'vitest';
import { evaluateTimelineEngine } from '../src/index.js';

describe('Timeline Engine Reproducibility & Policy Validation', () => {
  const input = {
    astrology: {
      birthTime: { utcInstant: '1995-10-25T08:30:00.000Z' },
      planets: [
        { planet: 'Sun', longitude: 210.0, sign: { name: 'Libra' }, house: 1, dignity: 'DEBILITATED' },
        { planet: 'Moon', longitude: 120.0, sign: { name: 'Leo' }, house: 11 },
        { planet: 'Jupiter', longitude: 240.0, sign: { name: 'Sagittarius' }, house: 3, dignity: 'OWN_SIGN' },
      ],
    },
    analysis: {
      houseLordFacts: [{ house: 1, lord: 'Venus', lordHouse: 2 }],
    },
    dasha: {
      mahadashas: [
        {
          level: 'MAHADASHA',
          lord: 'Sun',
          start: new Date('2022-01-01T00:00:00Z'),
          end: new Date('2028-01-01T00:00:00Z'),
        },
      ],
    },
  };

  it('preserves exact audit hash across 10 identical evaluations', () => {
    const targetDate = new Date('2026-08-30T10:00:00.000Z');
    const first = evaluateTimelineEngine(input, { currentDate: targetDate });

    for (let i = 0; i < 10; i++) {
      const current = evaluateTimelineEngine(input, { currentDate: targetDate });
      expect(current.audit.hashKey).toBe(first.audit.hashKey);
    }
  });

  it('preserves opposing supportive and challenging evidence without subtraction', () => {
    const targetDate = new Date('2026-08-30T10:00:00.000Z');
    const result = evaluateTimelineEngine(input, { currentDate: targetDate });

    for (const win of result.timingWindows) {
      expect(win.supportScore).toBeGreaterThanOrEqual(0);
      expect(win.challengeScore).toBeGreaterThanOrEqual(0);
    }
  });
});
