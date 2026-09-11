import { describe, expect, it } from 'vitest';
import { RASHIS, BirthChart, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { evaluateShadbalaEngine, PERSONAL_SHADBALA_V1 } from '@vedica/shadbala-engine';

import testCases from '../shadbala-test-cases/synthetic-shadbala-cases.json';

function createTestChart(): BirthChart {
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
      { planet: 'Sun', longitude: 10.0, signIndex: 1, signName: 'Aries', signLord: 'Mars', house: 1, degreeInSign: 10.0, speed: 1.0, isRetrograde: false, nakshatraIndex: 0, nakshatraName: 'Ashwini', pada: 3, sign: { id: 1, name: 'Aries', lord: 'Mars' }, nakshatra: { id: 1, name: 'Ashwini', lord: 'Ketu', pada: 3 } },
      { planet: 'Moon', longitude: 33.0, signIndex: 2, signName: 'Taurus', signLord: 'Venus', house: 2, degreeInSign: 3.0, speed: 13.0, isRetrograde: false, nakshatraIndex: 2, nakshatraName: 'Krittika', pada: 2, sign: { id: 2, name: 'Taurus', lord: 'Venus' }, nakshatra: { id: 3, name: 'Krittika', lord: 'Sun', pada: 2 } },
      { planet: 'Mars', longitude: 298.0, signIndex: 10, signName: 'Capricorn', signLord: 'Saturn', house: 10, degreeInSign: 28.0, speed: 0.6, isRetrograde: false, nakshatraIndex: 21, nakshatraName: 'Dhanishta', pada: 2, sign: { id: 10, name: 'Capricorn', lord: 'Saturn' }, nakshatra: { id: 23, name: 'Dhanishta', lord: 'Mars', pada: 2 } },
      { planet: 'Mercury', longitude: 165.0, signIndex: 6, signName: 'Virgo', signLord: 'Mercury', house: 6, degreeInSign: 15.0, speed: 1.2, isRetrograde: false, nakshatraIndex: 12, nakshatraName: 'Hasta', pada: 2, sign: { id: 6, name: 'Virgo', lord: 'Mercury' }, nakshatra: { id: 13, name: 'Hasta', lord: 'Moon', pada: 2 } },
      { planet: 'Jupiter', longitude: 95.0, signIndex: 4, signName: 'Cancer', signLord: 'Moon', house: 4, degreeInSign: 5.0, speed: 0.1, isRetrograde: false, nakshatraIndex: 7, nakshatraName: 'Pushya', pada: 1, sign: { id: 4, name: 'Cancer', lord: 'Moon' }, nakshatra: { id: 8, name: 'Pushya', lord: 'Saturn', pada: 1 } },
      { planet: 'Venus', longitude: 357.0, signIndex: 12, signName: 'Pisces', signLord: 'Jupiter', house: 12, degreeInSign: 27.0, speed: 1.1, isRetrograde: false, nakshatraIndex: 26, nakshatraName: 'Revati', pada: 4, sign: { id: 12, name: 'Pisces', lord: 'Jupiter' }, nakshatra: { id: 27, name: 'Revati', lord: 'Mercury', pada: 4 } },
      { planet: 'Saturn', longitude: 200.0, signIndex: 7, signName: 'Libra', signLord: 'Venus', house: 7, degreeInSign: 20.0, speed: -0.05, isRetrograde: true, nakshatraIndex: 15, nakshatraName: 'Vishakha', pada: 1, sign: { id: 7, name: 'Libra', lord: 'Venus' }, nakshatra: { id: 16, name: 'Vishakha', lord: 'Jupiter', pada: 1 } },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      cuspLongitude: (i * 30 + 15) % 360,
      signIndex: i + 1,
      signName: RASHIS[i].name,
      signLord: RASHIS[i].ruler,
    })),
  };
}

describe('Validation Suite — Shadbala Mathematical Engine', () => {
  it('loads 11 synthetic benchmark test cases', () => {
    expect(testCases.length).toBe(11);
  });

  it('runs Shadbala engine on standard birth chart and validates complete calculation', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);

    const result = evaluateShadbalaEngine({ chart, analysis }, PERSONAL_SHADBALA_V1);

    expect(result.profileVersion).toBe('personal-shadbala-v1');
    expect(result.completeness).toBe('COMPLETE');
    expect(result.unit).toBe('VIRUPA');
    expect(result.virupaPerRupa).toBe(60);

    for (const p of result.planets) {
      expect(p.components.sthana).toBeDefined();
      expect(p.components.dig).toBeDefined();
      expect(p.components.naisargika).toBeDefined();
      expect(p.components.cheshta).toBeDefined();
      expect(p.components.kaala).toBeDefined();
      expect(p.components.drik).toBeDefined();
      expect(p.totalVirupas).toBeGreaterThan(0);
      expect(p.evidence.length).toBeGreaterThan(0);
    }
  });

  it('verifies Shadbala execution does NOT mutate input chart or analysis', () => {
    const chart = createTestChart();
    const chartJson = JSON.stringify(chart);
    const analysis = analyzeChart(chart);
    const analysisJson = JSON.stringify(analysis);

    evaluateShadbalaEngine({ chart, analysis });

    expect(JSON.stringify(chart)).toBe(chartJson);
    expect(JSON.stringify(analysis)).toBe(analysisJson);
  });
});
