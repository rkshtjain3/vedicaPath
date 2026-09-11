import { describe, expect, it } from 'vitest';
import { analyzeChart } from '@vedica/analysis-engine';
import { BirthChart, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import {
  evaluateRulesEngine,
  isPlanetConnectedToHouse,
  PERSONAL_RULES_V1,
  careerRule001,
  careerRule002,
  wealthRule001,
  relRule001,
  propRule001,
} from '../src/index.js';

// Mock minimal test chart
function createTestChart(overrides?: Partial<BirthChart>): BirthChart {
  return {
    calculationProfileVersion: PERSONAL_VEDIC_V1.version,
    utcInstant: { julianDayUtc: 2451545.0, isoString: '2000-01-01T12:00:00.000Z' },
    location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
    siderealAyana: 23.85,
    lagna: {
      sign: { id: 1, name: 'Aries', lord: 'Mars' },
      longitude: 15.0,
      degreeInSign: 15.0,
      nakshatra: { id: 1, name: 'Ashwini', lord: 'Ketu', pada: 1 },
    },
    ascendant: { signIndex: 1, signName: 'Aries', signLord: 'Mars', longitude: 15.0, nakshatraIndex: 0, nakshatraName: 'Ashwini', pada: 1 },
    planets: [
      { planet: 'Sun', longitude: 275.0, signIndex: 10, signName: 'Capricorn', signLord: 'Saturn', house: 10, degreeInSign: 5.0, speed: 1.0, isRetrograde: false, nakshatraIndex: 20, nakshatraName: 'Uttara Ashadha', pada: 3, sign: { id: 10, name: 'Capricorn', lord: 'Saturn' }, nakshatra: { id: 21, name: 'Uttara Ashadha', lord: 'Sun', pada: 3 } },
      { planet: 'Moon', longitude: 40.0, signIndex: 2, signName: 'Taurus', signLord: 'Venus', house: 2, degreeInSign: 10.0, speed: 13.0, isRetrograde: false, nakshatraIndex: 3, nakshatraName: 'Rohini', pada: 1, sign: { id: 2, name: 'Taurus', lord: 'Venus' }, nakshatra: { id: 4, name: 'Rohini', lord: 'Moon', pada: 1 } },
      { planet: 'Mars', longitude: 280.0, signIndex: 10, signName: 'Capricorn', signLord: 'Saturn', house: 10, degreeInSign: 10.0, speed: 0.6, isRetrograde: false, nakshatraIndex: 21, nakshatraName: 'Shravana', pada: 1, sign: { id: 10, name: 'Capricorn', lord: 'Saturn' }, nakshatra: { id: 22, name: 'Shravana', lord: 'Moon', pada: 1 } },
      { planet: 'Mercury', longitude: 260.0, signIndex: 9, signName: 'Sagittarius', signLord: 'Jupiter', house: 9, degreeInSign: 20.0, speed: 1.2, isRetrograde: false, nakshatraIndex: 19, nakshatraName: 'Mula', pada: 4, sign: { id: 9, name: 'Sagittarius', lord: 'Jupiter' }, nakshatra: { id: 20, name: 'Mula', lord: 'Ketu', pada: 4 } },
      { planet: 'Jupiter', longitude: 15.0, signIndex: 1, signName: 'Aries', signLord: 'Mars', house: 1, degreeInSign: 15.0, speed: 0.1, isRetrograde: false, nakshatraIndex: 0, nakshatraName: 'Ashwini', pada: 1, sign: { id: 1, name: 'Aries', lord: 'Mars' }, nakshatra: { id: 1, name: 'Ashwini', lord: 'Ketu', pada: 1 } },
      { planet: 'Venus', longitude: 335.0, signIndex: 12, signName: 'Pisces', signLord: 'Jupiter', house: 12, degreeInSign: 5.0, speed: 1.1, isRetrograde: false, nakshatraIndex: 26, nakshatraName: 'Revati', pada: 3, sign: { id: 12, name: 'Pisces', lord: 'Jupiter' }, nakshatra: { id: 27, name: 'Revati', lord: 'Mercury', pada: 3 } },
      { planet: 'Saturn', longitude: 285.0, signIndex: 10, signName: 'Capricorn', signLord: 'Saturn', house: 10, degreeInSign: 15.0, speed: -0.05, isRetrograde: true, nakshatraIndex: 21, nakshatraName: 'Shravana', pada: 2, sign: { id: 10, name: 'Capricorn', lord: 'Saturn' }, nakshatra: { id: 22, name: 'Shravana', lord: 'Moon', pada: 2 } },
      { planet: 'Rahu', longitude: 110.0, signIndex: 4, signName: 'Cancer', signLord: 'Moon', house: 4, degreeInSign: 20.0, speed: -0.05, isRetrograde: true, nakshatraIndex: 8, nakshatraName: 'Aslesha', pada: 2, sign: { id: 4, name: 'Cancer', lord: 'Moon' }, nakshatra: { id: 9, name: 'Aslesha', lord: 'Mercury', pada: 2 } },
      { planet: 'Ketu', longitude: 290.0, signIndex: 10, signName: 'Capricorn', signLord: 'Saturn', house: 10, degreeInSign: 20.0, speed: -0.05, isRetrograde: true, nakshatraIndex: 21, nakshatraName: 'Shravana', pada: 4, sign: { id: 10, name: 'Capricorn', lord: 'Saturn' }, nakshatra: { id: 22, name: 'Shravana', lord: 'Moon', pada: 4 } },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      cuspLongitude: (i * 30 + 15) % 360,
      signIndex: i + 1,
      signName: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][i],
      signLord: ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'][i],
    })),
    ...overrides,
  };
}

describe('Rules Engine — Connection Resolver & Rules', () => {
  it('isPlanetConnectedToHouse detects occupation correctly', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);

    const conn = isPlanetConnectedToHouse('Mars', 10, analysis);
    expect(conn.connected).toBe(true);
    expect(conn.evidence.some((e) => e.type === 'PLANET_OCCUPIES_HOUSE')).toBe(true);
  });

  it('CAREER-001 evaluates positive when 10th lord is strong', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = {
      chart,
      currentDasha: {},
      analysis,
    };

    const res = careerRule001.evaluate(context);
    expect(res.ruleId).toBe('CAREER-001');
    expect(res.triggered).toBe(true);
    expect(res.effects).toEqual([
      { dimension: 'Growth', value: 2 },
      { dimension: 'Stability', value: 2 },
    ]);
  });

  it('CAREER-002 triggers when Mahadasha lord is connected to 10th house', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = {
      chart,
      currentDasha: {
        mahadasha: { level: 'MAHADASHA', lord: 'Mars', start: new Date(), end: new Date() },
      },
      analysis,
    };

    const res = careerRule002.evaluate(context);
    expect(res.triggered).toBe(true);
    expect(res.effects).toEqual([
      { dimension: 'Change', value: 2 },
      { dimension: 'Growth', value: 1 },
    ]);
  });

  it('WEALTH-001 evaluates 2nd and 11th house lord dignities', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = { chart, currentDasha: {}, analysis };

    const res = wealthRule001.evaluate(context);
    expect(res.domain).toBe('WEALTH');
    expect(res.evidence.length).toBeGreaterThan(0);
  });

  it('REL-001 evaluates 7th lord dignity & placement', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = { chart, currentDasha: {}, analysis };

    const res = relRule001.evaluate(context);
    expect(res.domain).toBe('RELATIONSHIPS');
  });

  it('PROP-001 evaluates 4th lord dignity & placement', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = { chart, currentDasha: {}, analysis };

    const res = propRule001.evaluate(context);
    expect(res.domain).toBe('PROPERTY');
  });
});

describe('Rules Engine — Aggregator & Profile Versioning', () => {
  it('evaluateRulesEngine produces full domain analysis with correct ratings and profile versions', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = {
      chart,
      currentDasha: {
        mahadasha: { level: 'MAHADASHA', lord: 'Mars', start: new Date(), end: new Date() },
        antardasha: { level: 'ANTARDASHA', lord: 'Jupiter', start: new Date(), end: new Date() },
      },
      analysis,
    };

    const result = evaluateRulesEngine(context, PERSONAL_RULES_V1);

    expect(result.rulesProfileVersion).toBe('personal-rules-v1');
    expect(result.calculationProfileVersion).toBe('personal-vedic-v1');
    expect(result.analysisProfileVersion).toBe('personal-analysis-v1');

    expect(result.domains.CAREER).toBeDefined();
    expect(result.domains.WEALTH).toBeDefined();
    expect(result.domains.RELATIONSHIPS).toBeDefined();
    expect(result.domains.PROPERTY).toBeDefined();

    // Verify rating conversion
    const careerGrowthRating = result.domains.CAREER.dimensionRatings.Growth;
    expect(['LOW', 'MODERATE', 'HIGH']).toContain(careerGrowthRating);

    // Verify evidence is preserved
    expect(result.domains.CAREER.evaluations[0].evidence).toBeDefined();
  });
});
