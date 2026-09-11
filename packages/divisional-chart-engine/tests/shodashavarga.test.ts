import { describe, it, expect } from 'vitest';
import { calculateChaturthamsaPosition } from '../src/calculators/chaturthamsa-calculator.js';
import { calculateShodashamsaPosition } from '../src/calculators/shodashamsa-calculator.js';
import { calculateVimsamsaPosition } from '../src/calculators/vimsamsa-calculator.js';
import { calculateChaturvimsamsaPosition } from '../src/calculators/chaturvimsamsa-calculator.js';
import { calculateSaptavimsamsaPosition } from '../src/calculators/saptavimsamsa-calculator.js';
import { calculateKhavedamsaPosition } from '../src/calculators/khavedamsa-calculator.js';
import { calculateAkshavedamsaPosition } from '../src/calculators/akshavedamsa-calculator.js';
import { calculateShashtyamsaPosition } from '../src/calculators/shashtyamsa-calculator.js';
import { calculateAllDivisionalCharts, calculateDivisionalChart } from '../src/charts/divisional-chart-engine.js';
import { calculateVimsopakaBala } from '../src/vimsopaka/vimsopaka-calculator.js';
import { BirthChart, PlanetPosition } from '@vedica/astrology-core';

describe('D4 Chaturthamsa Calculator', () => {
  it('calculates 4 Kendra quarters correctly', () => {
    // Aries (1): 0-7.5 deg -> Aries (1), 7.5-15 deg -> Cancer (4), 15-22.5 deg -> Libra (7), 22.5-30 deg -> Capricorn (10)
    expect(calculateChaturthamsaPosition(3).sign.id).toBe(1); // Aries
    expect(calculateChaturthamsaPosition(10).sign.id).toBe(4); // Cancer
    expect(calculateChaturthamsaPosition(18).sign.id).toBe(7); // Libra
    expect(calculateChaturthamsaPosition(26).sign.id).toBe(10); // Capricorn
  });
});

describe('D16 Shodashamsa Calculator', () => {
  it('calculates D16 correctly based on Movable, Fixed, Dual', () => {
    // Movable (Aries 1): starts from Aries (1)
    expect(calculateShodashamsaPosition(1).sign.id).toBe(1); // 1st div (0-1.875 deg) -> Aries (1)
    expect(calculateShodashamsaPosition(3).sign.id).toBe(2); // 2nd div (1.875-3.75 deg) -> Taurus (2)

    // Fixed (Taurus 2): starts from Leo (5)
    expect(calculateShodashamsaPosition(31).sign.id).toBe(5); // 1 deg Taurus -> Leo (5)

    // Dual (Gemini 3): starts from Sagittarius (9)
    expect(calculateShodashamsaPosition(61).sign.id).toBe(9); // 1 deg Gemini -> Sagittarius (9)
  });
});

describe('D20 Vimsamsa Calculator', () => {
  it('calculates D20 correctly based on Movable, Fixed, Dual', () => {
    // Movable (Aries 1): starts from Aries (1)
    expect(calculateVimsamsaPosition(1).sign.id).toBe(1);

    // Fixed (Taurus 2): starts from Sagittarius (9)
    expect(calculateVimsamsaPosition(31).sign.id).toBe(9);

    // Dual (Gemini 3): starts from Leo (5)
    expect(calculateVimsamsaPosition(61).sign.id).toBe(5);
  });
});

describe('D24 Chaturvimsamsa Calculator', () => {
  it('calculates D24 correctly for Odd and Even signs', () => {
    // Odd (Aries 1): starts from Leo (5)
    expect(calculateChaturvimsamsaPosition(1).sign.id).toBe(5); // 1st div -> Leo (5)
    expect(calculateChaturvimsamsaPosition(2).sign.id).toBe(6); // 2nd div (1.25-2.5 deg) -> Virgo (6)

    // Even (Taurus 2): starts from Cancer (4)
    expect(calculateChaturvimsamsaPosition(31).sign.id).toBe(4); // 1 deg Taurus -> Cancer (4)
  });
});

describe('D27 Saptavimsamsa Calculator', () => {
  it('calculates D27 correctly for Fire, Earth, Air, Water signs', () => {
    // Fire (Aries 1): starts Aries (1)
    expect(calculateSaptavimsamsaPosition(1).sign.id).toBe(1);

    // Earth (Taurus 2): starts Cancer (4)
    expect(calculateSaptavimsamsaPosition(31).sign.id).toBe(4);

    // Air (Gemini 3): starts Libra (7)
    expect(calculateSaptavimsamsaPosition(61).sign.id).toBe(7);

    // Water (Cancer 4): starts Capricorn (10)
    expect(calculateSaptavimsamsaPosition(91).sign.id).toBe(10);
  });
});

describe('D40 Khavedamsa Calculator', () => {
  it('calculates D40 correctly for Odd and Even signs', () => {
    // Odd (Aries 1): starts Aries (1)
    expect(calculateKhavedamsaPosition(0.5).sign.id).toBe(1);

    // Even (Taurus 2): starts Libra (7)
    expect(calculateKhavedamsaPosition(30.5).sign.id).toBe(7);
  });
});

describe('D45 Akshavedamsa Calculator', () => {
  it('calculates D45 correctly for Movable, Fixed, Dual', () => {
    // Movable (Aries 1): starts Aries (1)
    expect(calculateAkshavedamsaPosition(0.5).sign.id).toBe(1);

    // Fixed (Taurus 2): starts Leo (5)
    expect(calculateAkshavedamsaPosition(30.5).sign.id).toBe(5);

    // Dual (Gemini 3): starts Sagittarius (9)
    expect(calculateAkshavedamsaPosition(60.5).sign.id).toBe(9);
  });
});

describe('D60 Shashtyamsa Calculator', () => {
  it('calculates D60 sign and deities correctly', () => {
    // Aries (1) at 0.25 deg -> 1st division: Aries (1), Deity: Ghora (Asubha)
    const pos1 = calculateShashtyamsaPosition(0.25);
    expect(pos1.sign.id).toBe(1);
    expect(pos1.divisionNumber).toBe(1);
    expect(pos1.deityName).toBe('Ghora');
    expect(pos1.isAuspicious).toBe(false);

    // Aries at 1.25 deg -> 3rd division: Gemini (3), Deity: Deva (Subha)
    const pos3 = calculateShashtyamsaPosition(1.25);
    expect(pos3.sign.id).toBe(3);
    expect(pos3.divisionNumber).toBe(3);
    expect(pos3.deityName).toBe('Deva');
    expect(pos3.isAuspicious).toBe(true);

    // Taurus (2, Even) at 30.25 deg -> 1st division: Taurus (2), Deity: Chandrarekha (60th deity reverse count)
    const posEven = calculateShashtyamsaPosition(30.25);
    expect(posEven.sign.id).toBe(2);
    expect(posEven.divisionNumber).toBe(1);
    expect(posEven.deityName).toBe('Chandrarekha');
    expect(posEven.isAuspicious).toBe(true);
  });
});

describe('Full 16 Shodashavarga and Vimsopaka Bala Orchestration', () => {
  const samplePlanets: PlanetPosition[] = [
    {
      planet: 'Sun',
      longitude: 10, // Aries 10° (Exalted in D1)
      rashi: { id: 1, name: 'Aries', ruler: 'Mars', element: 'Fire', modality: 'Movable' },
      degreesInRashi: 10,
      nakshatra: { name: 'Ashwini', lord: 'Ketu', pad: 4 },
      isRetrograde: false,
      speed: 1.0,
    },
    {
      planet: 'Moon',
      longitude: 33, // Taurus 3° (Exalted in D1)
      rashi: { id: 2, name: 'Taurus', ruler: 'Venus', element: 'Earth', modality: 'Fixed' },
      degreesInRashi: 3,
      nakshatra: { name: 'Krittika', lord: 'Sun', pad: 2 },
      isRetrograde: false,
      speed: 13.0,
    },
    {
      planet: 'Mars',
      longitude: 298, // Capricorn 28° (Exalted in D1)
      rashi: { id: 10, name: 'Capricorn', ruler: 'Saturn', element: 'Earth', modality: 'Movable' },
      degreesInRashi: 28,
      nakshatra: { name: 'Dhanishta', lord: 'Mars', pad: 2 },
      isRetrograde: false,
      speed: 0.8,
    },
    {
      planet: 'Mercury',
      longitude: 165, // Virgo 15° (Exalted in D1)
      rashi: { id: 6, name: 'Virgo', ruler: 'Mercury', element: 'Earth', modality: 'Dual' },
      degreesInRashi: 15,
      nakshatra: { name: 'Hasta', lord: 'Moon', pad: 2 },
      isRetrograde: false,
      speed: 1.2,
    },
    {
      planet: 'Jupiter',
      longitude: 95, // Cancer 5° (Exalted in D1)
      rashi: { id: 4, name: 'Cancer', ruler: 'Moon', element: 'Water', modality: 'Movable' },
      degreesInRashi: 5,
      nakshatra: { name: 'Pushya', lord: 'Saturn', pad: 1 },
      isRetrograde: false,
      speed: 0.1,
    },
    {
      planet: 'Venus',
      longitude: 357, // Pisces 27° (Exalted in D1)
      rashi: { id: 12, name: 'Pisces', ruler: 'Jupiter', element: 'Water', modality: 'Dual' },
      degreesInRashi: 27,
      nakshatra: { name: 'Revati', lord: 'Mercury', pad: 4 },
      isRetrograde: false,
      speed: 1.1,
    },
    {
      planet: 'Saturn',
      longitude: 200, // Libra 20° (Exalted in D1)
      rashi: { id: 7, name: 'Libra', ruler: 'Venus', element: 'Air', modality: 'Movable' },
      degreesInRashi: 20,
      nakshatra: { name: 'Swati', lord: 'Rahu', pad: 4 },
      isRetrograde: false,
      speed: 0.05,
    },
    {
      planet: 'Rahu',
      longitude: 45,
      rashi: { id: 2, name: 'Taurus', ruler: 'Venus', element: 'Earth', modality: 'Fixed' },
      degreesInRashi: 15,
      nakshatra: { name: 'Rohini', lord: 'Moon', pad: 2 },
      isRetrograde: true,
      speed: -0.05,
    },
    {
      planet: 'Ketu',
      longitude: 225,
      rashi: { id: 8, name: 'Scorpio', ruler: 'Mars', element: 'Water', modality: 'Fixed' },
      degreesInRashi: 15,
      nakshatra: { name: 'Anuradha', lord: 'Saturn', pad: 4 },
      isRetrograde: true,
      speed: -0.05,
    },
  ];

  const sampleBirthChart: BirthChart = {
    profileVersion: 'v1',
    ayanamsaName: 'Lahiri',
    ayanamsaValue: 23.85,
    ascendant: {
      rashi: { id: 1, name: 'Aries', ruler: 'Mars', element: 'Fire', modality: 'Movable' },
      degreesInRashi: 12,
      totalLongitude: 12,
      nakshatra: { name: 'Ashwini', lord: 'Ketu', pad: 4 },
    },
    planets: samplePlanets,
    houses: [],
  };

  it('calculates all 16 Shodashavarga charts seamlessly', () => {
    const allCharts = calculateAllDivisionalCharts(sampleBirthChart);
    const expectedKeys = [
      'D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12',
      'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60',
    ];
    expect(Object.keys(allCharts).sort()).toEqual(expectedKeys.sort());

    for (const key of expectedKeys) {
      const chart = allCharts[key as keyof typeof allCharts];
      expect(chart).toBeDefined();
      expect(chart.ascendant).toBeDefined();
      expect(chart.houses).toHaveLength(12);
      expect(Object.keys(chart.planets)).toHaveLength(9);
    }
  });

  it('calculates Vimsopaka Bala across 16 vargas with accurate scoring', () => {
    const allCharts = calculateAllDivisionalCharts(sampleBirthChart);
    const vimsopaka = calculateVimsopakaBala(sampleBirthChart, allCharts, 'SHODASHAVARGA');

    expect(vimsopaka.scheme).toBe('SHODASHAVARGA');
    expect(vimsopaka.ranking).toHaveLength(7);

    for (const item of vimsopaka.ranking) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(20);
      const planetData = vimsopaka.planets[item.planet];
      expect(planetData.vargaScores).toHaveLength(16);
    }
  });
});
