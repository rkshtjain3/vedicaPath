import { describe, it, expect } from 'vitest';
import { calculateReferenceCompleteness } from '../src/services/completeness-calculator.js';

describe('Reference Completeness Calculator', () => {
  it('should return NOT_AVAILABLE (0%) for empty reference values', () => {
    const res = calculateReferenceCompleteness({});
    expect(res.status).toBe('NOT_AVAILABLE');
    expect(res.overallPercent).toBe(0);
  });

  it('should calculate PARTIAL coverage when only Ascendant and Planets are entered', () => {
    const refValues = {
      astrology: {
        ascendantLongitude: 100.5,
        ascendantSign: 'Cancer',
        planetaryLongitudes: { Sun: 60.3, Moon: 22.5 },
        planetarySigns: { Sun: 'Gemini', Moon: 'Aries' },
      },
    };

    const res = calculateReferenceCompleteness(refValues);
    expect(res.status).toBe('PARTIAL');
    expect(res.overallPercent).toBeGreaterThan(0);
    expect(res.overallPercent).toBeLessThan(100);
  });

  it('should calculate COMPLETE coverage when all reference fields are populated', () => {
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const pDict = Object.fromEntries(planetNames.map((p) => [p, 10]));
    const sDict = Object.fromEntries(planetNames.map((p) => [p, 'Aries']));
    const divDict = Object.fromEntries(['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12', 'D30'].map((c) => [c, sDict]));

    const refValues = {
      astrology: {
        ascendantLongitude: 100.5,
        ascendantSign: 'Cancer',
        planetaryLongitudes: pDict,
        planetarySigns: sDict,
      },
      nakshatras: sDict,
      padas: Object.fromEntries(planetNames.map((p) => [p, 1])),
      dasha: { birthNakshatra: 'Bharani', dashaStartingLord: 'Venus', balanceYearsAtBirth: '6.22' },
      divisionalCharts: divDict,
    };

    const res = calculateReferenceCompleteness(refValues);
    expect(res.status).toBe('COMPLETE');
    expect(res.overallPercent).toBe(100);
  });
});
