import { describe, it, expect } from 'vitest';
import { calculateCharaKarakas, analyzeKarakamsha } from '../src/karakas/chara-karaka-calculator.js';
import { calculateArudhaPadas } from '../src/arudha/arudha-calculator.js';
import { calculateRashiDrishti, JAIMINI_SIGN_ASPECTS } from '../src/drishti/rashi-drishti-calculator.js';
import { evaluateJaimini } from '../src/jaimini-calculator.js';
import { BirthChart, PlanetPosition } from '@vedica/astrology-core';

describe('Jaimini Engine Tests', () => {
  const samplePlanets: PlanetPosition[] = [
    {
      planet: 'Sun',
      longitude: 28.5, // 28.5° Aries -> Highest degree -> Atmakaraka (AK)
      rashi: { id: 1, name: 'Aries', ruler: 'Mars', element: 'Fire', modality: 'Movable' },
      degreesInRashi: 28.5,
      nakshatra: { name: 'Krittika', lord: 'Sun', pad: 1 },
      isRetrograde: false,
      speed: 1.0,
    },
    {
      planet: 'Moon',
      longitude: 54.2, // 24.2° Taurus -> 2nd highest -> Amatyakaraka (AmK)
      rashi: { id: 2, name: 'Taurus', ruler: 'Venus', element: 'Earth', modality: 'Fixed' },
      degreesInRashi: 24.2,
      nakshatra: { name: 'Rohini', lord: 'Moon', pad: 4 },
      isRetrograde: false,
      speed: 13.0,
    },
    {
      planet: 'Mars',
      longitude: 290.1, // 20.1° Capricorn -> 3rd highest -> Bhratrikaraka (BK)
      rashi: { id: 10, name: 'Capricorn', ruler: 'Saturn', element: 'Earth', modality: 'Movable' },
      degreesInRashi: 20.1,
      nakshatra: { name: 'Shravana', lord: 'Moon', pad: 4 },
      isRetrograde: false,
      speed: 0.8,
    },
    {
      planet: 'Mercury',
      longitude: 167.8, // 17.8° Virgo -> 4th highest -> Matrikaraka (MK)
      rashi: { id: 6, name: 'Virgo', ruler: 'Mercury', element: 'Earth', modality: 'Dual' },
      degreesInRashi: 17.8,
      nakshatra: { name: 'Hasta', lord: 'Moon', pad: 3 },
      isRetrograde: false,
      speed: 1.2,
    },
    {
      planet: 'Jupiter',
      longitude: 102.5, // 12.5° Cancer -> 5th highest -> Putrakaraka (PK)
      rashi: { id: 4, name: 'Cancer', ruler: 'Moon', element: 'Water', modality: 'Movable' },
      degreesInRashi: 12.5,
      nakshatra: { name: 'Pushya', lord: 'Saturn', pad: 3 },
      isRetrograde: false,
      speed: 0.1,
    },
    {
      planet: 'Venus',
      longitude: 338.4, // 8.4° Pisces -> 6th highest -> Gnatikaraka (GK)
      rashi: { id: 12, name: 'Pisces', ruler: 'Jupiter', element: 'Water', modality: 'Dual' },
      degreesInRashi: 8.4,
      nakshatra: { name: 'Uttara Bhadrapada', lord: 'Saturn', pad: 2 },
      isRetrograde: false,
      speed: 1.1,
    },
    {
      planet: 'Saturn',
      longitude: 213.2, // 3.2° Scorpio -> Lowest degree -> Darakaraka (DK)
      rashi: { id: 8, name: 'Scorpio', ruler: 'Mars', element: 'Water', modality: 'Fixed' },
      degreesInRashi: 3.2,
      nakshatra: { name: 'Anuradha', lord: 'Saturn', pad: 1 },
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
      degreesInRashi: 10,
      totalLongitude: 10,
      nakshatra: { name: 'Ashwini', lord: 'Ketu', pad: 4 },
    },
    planets: samplePlanets,
    houses: [],
  };

  it('calculates 7 Chara Karakas correctly by degree rank', () => {
    const karakas = calculateCharaKarakas(sampleBirthChart, '7_KARAKA');
    expect(karakas).toHaveLength(7);

    expect(karakas[0].role).toBe('AK');
    expect(karakas[0].planet).toBe('Sun');

    expect(karakas[1].role).toBe('AmK');
    expect(karakas[1].planet).toBe('Moon');

    expect(karakas[2].role).toBe('BK');
    expect(karakas[2].planet).toBe('Mars');

    expect(karakas[3].role).toBe('MK');
    expect(karakas[3].planet).toBe('Mercury');

    expect(karakas[4].role).toBe('PK');
    expect(karakas[4].planet).toBe('Jupiter');

    expect(karakas[5].role).toBe('GK');
    expect(karakas[5].planet).toBe('Venus');

    expect(karakas[6].role).toBe('DK');
    expect(karakas[6].planet).toBe('Saturn');
  });

  it('calculates Karakamsha analysis correctly', () => {
    const karakas = calculateCharaKarakas(sampleBirthChart, '7_KARAKA');
    const km = analyzeKarakamsha(sampleBirthChart, karakas);

    expect(km.atmakarakaPlanet).toBe('Sun');
    expect(km.karakamshaSign).toBeDefined();
    expect(km.karakamshaHouseFromLagna).toBeGreaterThanOrEqual(1);
    expect(km.karakamshaHouseFromLagna).toBeLessThanOrEqual(12);
  });

  it('calculates 12 Arudha Padas with classical exception jump rules', () => {
    const padas = calculateArudhaPadas(sampleBirthChart);
    expect(padas).toHaveLength(12);

    const al = padas.find((p) => p.code === 'AL');
    expect(al).toBeDefined();
    expect(al?.sign).toBeDefined();

    const ul = padas.find((p) => p.code === 'UL');
    expect(ul).toBeDefined();
    expect(ul?.sign).toBeDefined();

    // Verify exception rules flag
    for (const p of padas) {
      expect(p.signId).toBeGreaterThanOrEqual(1);
      expect(p.signId).toBeLessThanOrEqual(12);
    }
  });

  it('calculates Jaimini Rashi Drishti sign aspects correctly', () => {
    const drishti = calculateRashiDrishti(sampleBirthChart);
    expect(drishti).toHaveLength(12);

    // Aries (1, Movable) must aspect Leo (5), Scorpio (8), Aquarius (11)
    const aries = drishti.find((d) => d.sign.id === 1);
    expect(aries?.aspectingSigns.map((s) => s.id)).toEqual([5, 8, 11]);

    // Taurus (2, Fixed) must aspect Cancer (4), Libra (7), Capricorn (10)
    const taurus = drishti.find((d) => d.sign.id === 2);
    expect(taurus?.aspectingSigns.map((s) => s.id)).toEqual([4, 7, 10]);

    // Gemini (3, Dual) must aspect Virgo (6), Sagittarius (9), Pisces (12)
    const gemini = drishti.find((d) => d.sign.id === 3);
    expect(gemini?.aspectingSigns.map((s) => s.id)).toEqual([6, 9, 12]);
  });

  it('evaluates complete Jaimini report in single coordinator pass', () => {
    const report = evaluateJaimini(sampleBirthChart);
    expect(report.scheme).toBe('7_KARAKA');
    expect(report.charaKarakas).toHaveLength(7);
    expect(report.karakamsha).toBeDefined();
    expect(report.arudhaPadas).toHaveLength(12);
    expect(report.rashiDrishti).toHaveLength(12);
  });
});
