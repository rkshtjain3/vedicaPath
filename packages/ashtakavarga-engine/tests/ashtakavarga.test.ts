import { describe, it, expect } from 'vitest';
import {
  getRelativeHouse,
  CANONICAL_BINDU_RULES,
  calculateAshtakavarga,
  validateAshtakavarga,
  explainBinduForSign,
  AshtakavargaPlanet,
  AshtakavargaContributor,
} from '../src/index.js';

describe('Ashtakavarga Engine Unit Tests', () => {
  it('relative house calculation is mathematically correct', () => {
    expect(getRelativeHouse(1, 1)).toBe(1); // Same sign -> House 1
    expect(getRelativeHouse(1, 2)).toBe(2); // Next sign -> House 2
    expect(getRelativeHouse(12, 1)).toBe(2); // Pisces to Aries -> House 2
    expect(getRelativeHouse(1, 12)).toBe(12); // Aries to Pisces -> House 12
    expect(getRelativeHouse(5, 5)).toBe(1);
    expect(getRelativeHouse(5, 9)).toBe(5);
  });

  it('canonical Parashari BAV rule tables match expected bindu totals', () => {
    const expectedTotals: Record<AshtakavargaPlanet, number> = {
      SUN: 48,
      MOON: 49,
      MARS: 39,
      MERCURY: 54,
      JUPITER: 56,
      VENUS: 52,
      SATURN: 39,
    };

    let totalSavBindus = 0;

    for (const [planetKey, contributorMap] of Object.entries(CANONICAL_BINDU_RULES)) {
      const planet = planetKey as AshtakavargaPlanet;
      let planetRuleBindus = 0;

      for (const houses of Object.values(contributorMap)) {
        planetRuleBindus += houses.length;
      }

      expect(planetRuleBindus).toBe(expectedTotals[planet]);
      totalSavBindus += planetRuleBindus;
    }

    expect(totalSavBindus).toBe(337);
  });

  it('calculates BAV and SAV correctly for a mock birth chart', () => {
    const mockChart: any = {
      lagna: { sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
      planets: [
        { planet: 'Sun', sign: { id: 2, name: 'Taurus', sanskritName: 'Vrishabha', ruler: 'Venus' } },
        { planet: 'Moon', sign: { id: 4, name: 'Cancer', sanskritName: 'Karka', ruler: 'Moon' } },
        { planet: 'Mars', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Mercury', sign: { id: 3, name: 'Gemini', sanskritName: 'Mithuna', ruler: 'Mercury' } },
        { planet: 'Jupiter', sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' } },
        { planet: 'Venus', sign: { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' } },
        { planet: 'Saturn', sign: { id: 10, name: 'Capricorn', sanskritName: 'Makara', ruler: 'Saturn' } },
      ],
    };

    const result = calculateAshtakavarga(mockChart);

    expect(result.validation.passed).toBe(true);
    expect(result.validation.expected).toBe(337);
    expect(result.validation.actual).toBe(337);
    expect(result.sav.totalPoints).toBe(337);

    // Verify row totals
    expect(result.bav.SUN.totalPoints).toBe(48);
    expect(result.bav.MOON.totalPoints).toBe(49);
    expect(result.bav.MARS.totalPoints).toBe(39);
    expect(result.bav.MERCURY.totalPoints).toBe(54);
    expect(result.bav.JUPITER.totalPoints).toBe(56);
    expect(result.bav.VENUS.totalPoints).toBe(52);
    expect(result.bav.SATURN.totalPoints).toBe(39);
  });

  it('provides traceable explainability for bindus', () => {
    const mockChart: any = {
      lagna: { sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
      planets: [
        { planet: 'Sun', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Moon', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Mars', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Mercury', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Jupiter', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Venus', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Saturn', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
      ],
    };

    const result = calculateAshtakavarga(mockChart);
    const explanation = explainBinduForSign(result.bav, 'JUPITER', 'Aries');

    expect(explanation.targetPlanet).toBe('JUPITER');
    expect(explanation.signName).toBe('Aries');
    expect(explanation.details.length).toBe(8); // 8 contributors
    expect(explanation.details[0].evidence.length).toBeGreaterThan(0);
  });

  it('performs Trikona and Ekadhipatya Shodhanas and calculates Shodhya Pinda', () => {
    const mockChart: any = {
      lagna: { sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
      planets: [
        { planet: 'Sun', sign: { id: 2, name: 'Taurus', sanskritName: 'Vrishabha', ruler: 'Venus' } },
        { planet: 'Moon', sign: { id: 4, name: 'Cancer', sanskritName: 'Karka', ruler: 'Moon' } },
        { planet: 'Mars', sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
        { planet: 'Mercury', sign: { id: 3, name: 'Gemini', sanskritName: 'Mithuna', ruler: 'Mercury' } },
        { planet: 'Jupiter', sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' } },
        { planet: 'Venus', sign: { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' } },
        { planet: 'Saturn', sign: { id: 10, name: 'Capricorn', sanskritName: 'Makara', ruler: 'Saturn' } },
      ],
    };

    const result = calculateAshtakavarga(mockChart);

    expect(result.shodhana).toBeDefined();
    expect(result.shodhana.planetaryPindas.SUN.shodhyaPinda).toBeGreaterThan(0);
    expect(result.shodhana.totalSarvaShodhyaPinda).toBeGreaterThan(0);

    // Verify Trikona Shodhana reduced points <= raw points
    for (const [planet, pinda] of Object.entries(result.shodhana.planetaryPindas)) {
      for (const [sign, rawB] of Object.entries(pinda.rawPoints)) {
        const trikB = pinda.trikonaPoints[sign];
        const ekadB = pinda.ekadhipatyaPoints[sign];
        expect(trikB).toBeLessThanOrEqual(rawB);
        expect(ekadB).toBeLessThanOrEqual(trikB);
      }
    }
  });
});

