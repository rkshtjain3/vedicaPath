import { describe, expect, it } from 'vitest';
import { RASHIS, BirthChart, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import {
  virupasToRupas,
  rupasToVirupas,
  normalizeAngle360,
  angularDistance180,
  calculateUchchaBala,
  calculateKendradiBala,
  calculateDrekkanaBala,
  calculateOjayugmaBala,
  calculateDigBala,
  calculateNathonataBala,
  calculatePakshaBala,
  calculateTribhagaBala,
  calculateVarshaMasaDinaHoraBala,
  calculateAyanaBala,
  calculateYuddhaBala,
  calculateKaalaBala,
  calculateDrikBala,
  evaluateShadbalaEngine,
  NAISARGIKA_BALA_VIRUPAS,
  EXALTATION_DEBILITATION_POINTS,
  PERSONAL_SHADBALA_V1,
} from '../src/index.js';

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

describe('Shadbala Engine — Unit Conversion & Math', () => {
  it('converts 60 Virupas to 1 Rupa without rounding loss', () => {
    expect(virupasToRupas(60)).toBe(1.0);
    expect(virupasToRupas(30)).toBe(0.5);
    expect(virupasToRupas(15)).toBe(0.25);
    expect(rupasToVirupas(1.0)).toBe(60.0);
  });

  it('normalizes angles and calculates circular distance correctly', () => {
    expect(normalizeAngle360(370)).toBe(10);
    expect(normalizeAngle360(-10)).toBe(350);
    expect(angularDistance180(359, 1)).toBe(2);
    expect(angularDistance180(10, 190)).toBe(180);
    expect(angularDistance180(10, 100)).toBe(90);
  });
});

describe('Shadbala Engine — Uchcha Bala', () => {
  it('calculates 60 Virupas at maximum exaltation point (Sun at 10° Aries)', () => {
    const res = calculateUchchaBala('Sun', 10.0);
    expect(res.virupas).toBe(60.0);
    expect(res.rupas).toBe(1.0);
    expect(res.inputs.angularDistFromDebilitation).toBe(180.0);
  });

  it('calculates 0 Virupas at deepest debilitation point (Sun at 10° Libra = 190°)', () => {
    const res = calculateUchchaBala('Sun', 190.0);
    expect(res.virupas).toBe(0.0);
    expect(res.rupas).toBe(0.0);
    expect(res.inputs.angularDistFromDebilitation).toBe(0.0);
  });

  it('calculates 30 Virupas at midpoint between exaltation and debilitation (Sun at 100°)', () => {
    const res = calculateUchchaBala('Sun', 100.0);
    expect(res.virupas).toBe(30.0);
    expect(res.rupas).toBe(0.5);
  });
});

describe('Shadbala Engine — Kendradi Bala', () => {
  it('assigns 60 Virupas for Kendra houses (1, 4, 7, 10)', () => {
    expect(calculateKendradiBala('Jupiter', 1).virupas).toBe(60);
    expect(calculateKendradiBala('Jupiter', 4).virupas).toBe(60);
    expect(calculateKendradiBala('Jupiter', 7).virupas).toBe(60);
    expect(calculateKendradiBala('Jupiter', 10).virupas).toBe(60);
  });

  it('assigns 30 Virupas for Panaphara houses (2, 5, 8, 11)', () => {
    expect(calculateKendradiBala('Jupiter', 2).virupas).toBe(30);
    expect(calculateKendradiBala('Jupiter', 5).virupas).toBe(30);
    expect(calculateKendradiBala('Jupiter', 8).virupas).toBe(30);
    expect(calculateKendradiBala('Jupiter', 11).virupas).toBe(30);
  });

  it('assigns 15 Virupas for Apoklima houses (3, 6, 9, 12)', () => {
    expect(calculateKendradiBala('Jupiter', 3).virupas).toBe(15);
    expect(calculateKendradiBala('Jupiter', 6).virupas).toBe(15);
    expect(calculateKendradiBala('Jupiter', 9).virupas).toBe(15);
    expect(calculateKendradiBala('Jupiter', 12).virupas).toBe(15);
  });
});

describe('Shadbala Engine — Drekkana Bala', () => {
  it('assigns 15 Virupas to male planets in 1st Drekkana (0-10°)', () => {
    const res = calculateDrekkanaBala('Sun', 5.0);
    expect(res.inputs.drekkana).toBe(1);
    expect(res.virupas).toBe(15);
  });

  it('assigns 15 Virupas to neutral planets in 2nd Drekkana (10-20°)', () => {
    const res = calculateDrekkanaBala('Mercury', 15.0);
    expect(res.inputs.drekkana).toBe(2);
    expect(res.virupas).toBe(15);
  });

  it('assigns 15 Virupas to female planets in 3rd Drekkana (20-30°)', () => {
    const res = calculateDrekkanaBala('Venus', 25.0);
    expect(res.inputs.drekkana).toBe(3);
    expect(res.virupas).toBe(15);
  });
});

describe('Shadbala Engine — Naisargika Bala', () => {
  it('exposes classical fixed constants for 7 planets', () => {
    expect(NAISARGIKA_BALA_VIRUPAS.Sun).toBe(60.0);
    expect(NAISARGIKA_BALA_VIRUPAS.Saturn).toBeCloseTo(8.571, 3);
  });
});

describe('Shadbala Engine — Kaala Bala Subcomponents', () => {
  it('evaluates Nathonata Bala correctly for day and night planets', () => {
    // Sun in H10 (Day time): Day planets (Sun, Jupiter, Venus) get 60, Night get 0, Mercury gets 60
    const sunNathonataDay = calculateNathonataBala('Sun', 10);
    expect(sunNathonataDay.virupas).toBe(60);

    const saturnNathonataDay = calculateNathonataBala('Saturn', 10);
    expect(saturnNathonataDay.virupas).toBe(0);

    // Sun in H1 (Night time): Night planets (Moon, Mars, Saturn) get 60, Day planets get 0
    const saturnNathonataNight = calculateNathonataBala('Saturn', 1);
    expect(saturnNathonataNight.virupas).toBe(60);

    const sunNathonataNight = calculateNathonataBala('Sun', 1);
    expect(sunNathonataNight.virupas).toBe(0);

    const mercuryNathonata = calculateNathonataBala('Mercury', 1);
    expect(mercuryNathonata.virupas).toBe(60);
  });

  it('evaluates Paksha Bala correctly based on Sun-Moon angular elongation', () => {
    // Shukla Paksha: elongation 30° -> benefic gets elongation/3 = 10, malefic gets 60 - 10 = 50
    const jupPaksha = calculatePakshaBala('Jupiter', 0, 30);
    expect(jupPaksha.virupas).toBe(10);

    const sunPaksha = calculatePakshaBala('Sun', 0, 30);
    expect(sunPaksha.virupas).toBe(50);
  });

  it('evaluates Tribhaga Bala across 3 parts of day/night', () => {
    // Day Part 1 (H11, H12): Mercury gets 60
    expect(calculateTribhagaBala('Mercury', 12).virupas).toBe(60);
    expect(calculateTribhagaBala('Sun', 12).virupas).toBe(0);

    // Jupiter always gets 60
    expect(calculateTribhagaBala('Jupiter', 12).virupas).toBe(60);
  });
});

describe('Shadbala Engine — Drik Bala & Aspect Functions', () => {
  it('calculates aspectual strength and Parashari special aspects', () => {
    const planets = [
      { planet: 'Jupiter' as const, longitude: 0 },
      { planet: 'Sun' as const, longitude: 180 }, // Sun opposition (180°) -> Full aspect 60 virupas
    ];

    const sunDrik = calculateDrikBala('Sun', 180, planets);
    // Aspect from Jupiter (Benefic, 180° = 60 virupas) -> +15 virupas to Sun
    expect(sunDrik.virupas).toBe(15);
  });
});

describe('Shadbala Engine — Aggregator & Determinism', () => {
  it('runs evaluateShadbalaEngine producing COMPLETE status and all 6 classical components', () => {
    const chart = createTestChart();
    const analysis = analyzeChart(chart);

    const result = evaluateShadbalaEngine({ chart, analysis }, PERSONAL_SHADBALA_V1);

    expect(result.profileVersion).toBe('personal-shadbala-v1');
    expect(result.completeness).toBe('COMPLETE');
    expect(result.planets.length).toBe(7);

    for (const p of result.planets) {
      expect(p.components.sthana).toBeDefined();
      expect(p.components.dig).toBeDefined();
      expect(p.components.naisargika).toBeDefined();
      expect(p.components.cheshta).toBeDefined();
      expect(p.components.kaala).toBeDefined();
      expect(p.components.drik).toBeDefined();
      expect(p.totalVirupas).toBeGreaterThan(0);
      expect(p.totalRupas).toBe(virupasToRupas(p.totalVirupas));
      expect(p.shadbalaRatio).toBeDefined();
      expect(typeof p.isStrong).toBe('boolean');
      expect(p.evidence.length).toBeGreaterThan(0);
      expect(result.requiredStrength[p.planet].comparisonStatus).toBe('COMPARABLE');
    }
  });

  it('guarantees 100% deterministic output with no chart mutation', () => {
    const chart = createTestChart();
    const chartCopy = JSON.parse(JSON.stringify(chart));
    const analysis = analyzeChart(chart);

    const res1 = evaluateShadbalaEngine({ chart, analysis });
    const res2 = evaluateShadbalaEngine({ chart, analysis });

    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    expect(chart).toEqual(chartCopy); // Chart is not mutated
  });
});

