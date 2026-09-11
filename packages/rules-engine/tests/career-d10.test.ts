import { describe, expect, it } from 'vitest';
import { RASHIS, BirthChart, PERSONAL_VEDIC_V1, PlanetName } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { DivisionalChart, DivisionalPosition, DivisionalHouse } from '@vedica/divisional-chart-engine';
import {
  D10Career001Rule,
  D10Career002Rule,
  D10Career003Rule,
  D10Career004Rule,
  D10Career005Rule,
  evaluateCareerD10Rules,
  PERSONAL_CAREER_D10_RULES_V1,
  getD10HouseCategory,
} from '../src/index.js';

// Helper to create a minimal D10 chart
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

describe('D10 Career Rules — House Category Utility', () => {
  it('correctly classifies house categories', () => {
    expect(getD10HouseCategory(1)).toBe('KENDRA');
    expect(getD10HouseCategory(4)).toBe('KENDRA');
    expect(getD10HouseCategory(7)).toBe('KENDRA');
    expect(getD10HouseCategory(10)).toBe('KENDRA');
    expect(getD10HouseCategory(5)).toBe('TRIKONA');
    expect(getD10HouseCategory(9)).toBe('TRIKONA');
    expect(getD10HouseCategory(3)).toBe('UPACHAYA');
    expect(getD10HouseCategory(11)).toBe('UPACHAYA');
    expect(getD10HouseCategory(6)).toBe('DUSTHANA');
    expect(getD10HouseCategory(8)).toBe('DUSTHANA');
    expect(getD10HouseCategory(12)).toBe('DUSTHANA');
    expect(getD10HouseCategory(2)).toBe('OTHER');
  });
});

describe('D10 Career Rules — D10-CAREER-001 10th Lord Placement', () => {
  it('correctly resolves D10 10th Lord placement and house category', () => {
    // D10 Lagna = Aries (id 1), 10th sign = Capricorn (id 10), Lord = Saturn
    // Saturn placed in Capricorn (house 10) => OWN_SIGN, KENDRA
    const d10 = createTestD10Chart(1, {
      Saturn: { signId: 10, longitude: 285 },
      Sun: { signId: 5, longitude: 135 },
      Jupiter: { signId: 4, longitude: 100 },
      Moon: { signId: 2, longitude: 40 },
      Mars: { signId: 1, longitude: 10 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career001Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.triggered).toBe(true);
    expect(result.ruleId).toBe('D10-CAREER-001');
    expect(result.evidence[0].planet).toBe('Saturn');
    expect(result.evidence[0].d10House).toBe(10);
    expect(result.evidence[0].houseCategory).toBe('KENDRA');
    expect(result.evidence[0].effectClassification).toBe('SUPPORTIVE');
    expect(result.evidence[0].whyEvidence.length).toBeGreaterThan(0);
  });

  it('returns not triggered when D10 chart is missing', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career001Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis });
    expect(result.triggered).toBe(false);
  });
});

describe('D10 Career Rules — D10-CAREER-002 10th Lord Dignity', () => {
  it('evaluates OWN_SIGN dignity as SUPPORTIVE', () => {
    const d10 = createTestD10Chart(1, {
      Saturn: { signId: 10, longitude: 285 },
      Sun: { signId: 5, longitude: 135 },
      Jupiter: { signId: 4, longitude: 100 },
      Moon: { signId: 2, longitude: 40 },
      Mars: { signId: 1, longitude: 10 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career002Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.triggered).toBe(true);
    expect(result.evidence[0].dignity).toBe('OWN_SIGN');
    expect(result.evidence[0].effectClassification).toBe('SUPPORTIVE');
  });
});

describe('D10 Career Rules — D10-CAREER-003 Lagna Lord Placement', () => {
  it('correctly evaluates D10 Lagna Lord', () => {
    // D10 Lagna = Aries, Lord = Mars, placed in Aries (house 1) => KENDRA => SUPPORTIVE
    const d10 = createTestD10Chart(1, {
      Mars: { signId: 1, longitude: 10 },
      Saturn: { signId: 10, longitude: 285 },
      Sun: { signId: 5, longitude: 135 },
      Jupiter: { signId: 4, longitude: 100 },
      Moon: { signId: 2, longitude: 40 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career003Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.triggered).toBe(true);
    expect(result.evidence[0].planet).toBe('Mars');
    expect(result.evidence[0].d10House).toBe(1);
    expect(result.evidence[0].houseCategory).toBe('KENDRA');
    expect(result.evidence[0].effectClassification).toBe('SUPPORTIVE');
  });
});

describe('D10 Career Rules — D10-CAREER-004 Career Karaka Placement', () => {
  it('evaluates Sun, Saturn, Jupiter individually in D10', () => {
    const d10 = createTestD10Chart(1, {
      Sun: { signId: 5, longitude: 135 },
      Saturn: { signId: 10, longitude: 285 },
      Jupiter: { signId: 4, longitude: 100 },
      Mars: { signId: 1, longitude: 10 },
      Moon: { signId: 2, longitude: 40 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career004Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.triggered).toBe(true);
    expect(result.evidence.length).toBe(3);

    const sunEv = result.evidence.find((e) => e.planet === 'Sun');
    const satEv = result.evidence.find((e) => e.planet === 'Saturn');
    const jupEv = result.evidence.find((e) => e.planet === 'Jupiter');

    expect(sunEv).toBeDefined();
    expect(satEv).toBeDefined();
    expect(jupEv).toBeDefined();

    expect(sunEv!.effectClassification).toBeDefined();
    expect(satEv!.effectClassification).toBeDefined();
    expect(jupEv!.effectClassification).toBeDefined();
  });
});

describe('D10 Career Rules — D10-CAREER-005 D1/D10 Career Lord Relationship', () => {
  it('detects same planet when D1 and D10 10th lords match', () => {
    // D1: Lagna=Aries => 10th sign=Capricorn => lord=Saturn
    // D10: Lagna=Aries => 10th sign=Capricorn => lord=Saturn
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

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career005Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.triggered).toBe(true);
    expect(result.evidence[0].samePlanet).toBe(true);
    expect(result.evidence[0].effectClassification).toBe('SUPPORTIVE');
  });

  it('detects different planets when D1 and D10 10th lords differ', () => {
    // D1: Lagna=Aries => 10th=Capricorn => lord=Saturn
    // D10: Lagna=Leo => 10th=Taurus => lord=Venus
    const d10 = createTestD10Chart(5, {
      Venus: { signId: 5, longitude: 135 },
      Saturn: { signId: 10, longitude: 285 },
      Sun: { signId: 5, longitude: 130 },
      Jupiter: { signId: 4, longitude: 100 },
      Mars: { signId: 1, longitude: 10 },
      Moon: { signId: 2, longitude: 40 },
      Mercury: { signId: 3, longitude: 70 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const rule = new D10Career005Rule();

    const result = rule.evaluate({ chart, currentDasha: {}, analysis, d10Chart: d10 }, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.triggered).toBe(true);
    expect(result.evidence[0].samePlanet).toBe(false);
    expect(result.evidence[0].effectClassification).toBe('NEUTRAL');
  });
});

describe('D10 Career Rules — Evaluator & Mixed Signals', () => {
  it('evaluateCareerD10Rules produces complete analysis with summary facts', () => {
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

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = { chart, currentDasha: {}, analysis, d10Chart: d10 };

    const result = evaluateCareerD10Rules(context, PERSONAL_CAREER_D10_RULES_V1);

    expect(result.profileVersion).toBe('personal-career-d10-rules-v1');
    expect(result.rules.length).toBe(5);
    expect(result.summaryFacts).toBeDefined();
    expect(result.summaryFacts.d10LagnaSign).toBe('Aries');
    expect(result.summaryFacts.d10LagnaLord).toBe('Mars');
    expect(result.summaryFacts.d10TenthLord).toBe('Saturn');
    expect(typeof result.mixedSignals).toBe('boolean');
    expect(Array.isArray(result.supportiveEvidence)).toBe(true);
    expect(Array.isArray(result.challengingEvidence)).toBe(true);
    expect(Array.isArray(result.neutralEvidence)).toBe(true);
  });

  it('detects mixed signals when supportive and challenging evidence coexist', () => {
    // Place Saturn (10th lord) in Dusthana house 6 (CHALLENGING) but with OWN_SIGN dignity
    // Sun in Leo house 5 (OWN_SIGN => SUPPORTIVE)
    // This should produce at least some supportive and challenging evidence
    const d10 = createTestD10Chart(1, {
      Saturn: { signId: 6, longitude: 165 }, // Virgo, House 6 => DUSTHANA
      Sun: { signId: 5, longitude: 135 }, // Leo, House 5 => OWN_SIGN
      Jupiter: { signId: 4, longitude: 100 },
      Mars: { signId: 1, longitude: 10 },
      Moon: { signId: 2, longitude: 40 },
      Mercury: { signId: 3, longitude: 70 },
      Venus: { signId: 12, longitude: 335 },
      Rahu: { signId: 6, longitude: 160 },
      Ketu: { signId: 12, longitude: 340 },
    });

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = { chart, currentDasha: {}, analysis, d10Chart: d10 };

    const result = evaluateCareerD10Rules(context, PERSONAL_CAREER_D10_RULES_V1);

    // The 10th lord in house 6 => DUSTHANA => CHALLENGING (D10-CAREER-001)
    // Sun in Leo => OWN_SIGN for karaka => SUPPORTIVE (D10-CAREER-004)
    expect(result.challengingEvidence.length).toBeGreaterThan(0);
    expect(result.supportiveEvidence.length).toBeGreaterThan(0);
    expect(result.mixedSignals).toBe(true);
  });

  it('produces deterministic, identical results for the same input', () => {
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

    const chart = createTestChart();
    const analysis = analyzeChart(chart);
    const context = { chart, currentDasha: {}, analysis, d10Chart: d10 };

    const result1 = evaluateCareerD10Rules(context, PERSONAL_CAREER_D10_RULES_V1);
    const result2 = evaluateCareerD10Rules(context, PERSONAL_CAREER_D10_RULES_V1);

    expect(JSON.stringify(result1)).toBe(JSON.stringify(result2));
  });
});

describe('D10 Career Rules — Explicit Effect Mapping Verification', () => {
  it('profile contains all required effect mappings', () => {
    const profile = PERSONAL_CAREER_D10_RULES_V1;

    expect(profile.ruleEffects['D10-CAREER-001']).toBeDefined();
    expect(profile.ruleEffects['D10-CAREER-002']).toBeDefined();
    expect(profile.ruleEffects['D10-CAREER-003']).toBeDefined();
    expect(profile.ruleEffects['D10-CAREER-004']).toBeDefined();
    expect(profile.ruleEffects['D10-CAREER-005']).toBeDefined();

    // Dignity mappings
    expect(profile.ruleEffects['D10-CAREER-002'].EXALTED).toBe('SUPPORTIVE');
    expect(profile.ruleEffects['D10-CAREER-002'].OWN_SIGN).toBe('SUPPORTIVE');
    expect(profile.ruleEffects['D10-CAREER-002'].NEUTRAL_SIGN).toBe('NEUTRAL');
    expect(profile.ruleEffects['D10-CAREER-002'].ENEMY_SIGN).toBe('CHALLENGING');
    expect(profile.ruleEffects['D10-CAREER-002'].DEBILITATED).toBe('CHALLENGING');

    // House category mappings
    expect(profile.ruleEffects['D10-CAREER-001'].KENDRA).toBe('SUPPORTIVE');
    expect(profile.ruleEffects['D10-CAREER-001'].DUSTHANA).toBe('CHALLENGING');
    expect(profile.ruleEffects['D10-CAREER-001'].OTHER).toBe('NEUTRAL');

    // D1/D10 relationship mappings
    expect(profile.ruleEffects['D10-CAREER-005'].SAME_PLANET).toBe('SUPPORTIVE');
    expect(profile.ruleEffects['D10-CAREER-005'].DIFFERENT_PLANET).toBe('NEUTRAL');
  });
});
