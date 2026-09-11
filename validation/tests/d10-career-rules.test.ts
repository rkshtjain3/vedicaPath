import { describe, expect, it } from 'vitest';
import { BirthChart, PERSONAL_VEDIC_V1, RASHIS, PlanetName } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { DivisionalChart, DivisionalPosition, DivisionalHouse } from '@vedica/divisional-chart-engine';
import { evaluateCareerD10Rules, PERSONAL_CAREER_D10_RULES_V1 } from '@vedica/rules-engine';

import testCases from '../d10-career-rule-test-cases/d10-career-rule-cases.json';

function createTestD10Chart(lagnaSignId: number, planetPlacements: Record<string, { signId: number; longitude: number }>): DivisionalChart {
  const planets: Record<PlanetName, DivisionalPosition> = {} as any;
  for (const [name, placement] of Object.entries(planetPlacements)) {
    const sign = RASHIS[placement.signId - 1];
    planets[name as PlanetName] = {
      sign,
      longitudeInSign: placement.longitude % 30,
      formattedDegree: `${(placement.longitude % 30).toFixed(2)}°`,
      absoluteLongitude: placement.longitude,
      sourceLongitude: placement.longitude,
      divisionNumber: 1,
    };
  }

  const lagnSign = RASHIS[lagnaSignId - 1];
  const houses: DivisionalHouse[] = Array.from({ length: 12 }, (_, i) => {
    const hSignId = ((lagnaSignId + i - 1) % 12) + 1;
    const hSign = RASHIS[hSignId - 1];
    return {
      house: i + 1,
      sign: hSign,
      occupants: [],
      lord: hSign.ruler as PlanetName,
    };
  });

  return {
    type: 'D10',
    division: 10,
    profileVersion: 'personal-d10-v1',
    ascendant: {
      sign: lagnSign,
      longitudeInSign: 15,
      formattedDegree: '15°00\'00"',
      absoluteLongitude: (lagnaSignId - 1) * 30 + 15,
      sourceLongitude: (lagnaSignId - 1) * 30 + 15,
      divisionNumber: 1,
    },
    planets,
    houses,
  };
}

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
  };
}

describe('Validation Suite — D10 Career Rules Integration', () => {
  it('loads all 11 synthetic benchmark cases', () => {
    expect(testCases.length).toBe(11);
  });

  it('validates D10 career evidence with Aries Lagna D10 chart', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const d10 = createTestD10Chart(1, {
      Saturn: { signId: 10, longitude: 285 },
      Sun: { signId: 5, longitude: 135 },
      Jupiter: { signId: 4, longitude: 100 },
      Mars: { signId: 1, longitude: 10 },
      Moon: { signId: 2, longitude: 40 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const context = { chart, currentDasha: {}, analysis, d10Chart: d10 };
    const result = evaluateCareerD10Rules(context, PERSONAL_CAREER_D10_RULES_V1);

    // Validate structure
    expect(result.profileVersion).toBe('personal-career-d10-rules-v1');
    expect(result.rules.length).toBe(5);
    expect(result.summaryFacts.d10LagnaSign).toBe('Aries');
    expect(result.summaryFacts.d10TenthLord).toBe('Saturn');
    expect(result.summaryFacts.d10TenthLordHouseCategory).toBe('KENDRA');
    expect(result.summaryFacts.karakas.length).toBe(3);

    // Verify ALL rules produced WHY evidence
    for (const rule of result.rules) {
      expect(rule.triggered).toBe(true);
      for (const ev of rule.evidence) {
        expect(ev.whyEvidence).toBeDefined();
        expect(ev.whyEvidence.length).toBeGreaterThan(0);
      }
    }
  });

  it('verifies D10 evidence does NOT alter D1 rules output', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);

    // Run with D10
    const d10 = createTestD10Chart(1, {
      Saturn: { signId: 10, longitude: 285 },
      Sun: { signId: 5, longitude: 135 },
      Jupiter: { signId: 4, longitude: 100 },
      Mars: { signId: 1, longitude: 10 },
      Moon: { signId: 2, longitude: 40 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const d10Result = evaluateCareerD10Rules({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    // D10 evidence must NOT contain any effects (no points added)
    for (const rule of d10Result.rules) {
      expect(rule.effects.length).toBe(0);
    }

    // All D10 evidence uses CAREER_D10 domain, not CAREER
    for (const rule of d10Result.rules) {
      expect(rule.domain).toBe('CAREER_D10');
    }
  });
});
