import { describe, it, expect } from 'vitest';
import { calculateCharaKarakas, analyzeKarakamsha } from '../src/karakas/chara-karaka-calculator.js';
import { calculateArudhaPadas } from '../src/arudha/arudha-calculator.js';
import { calculateRashiDrishti } from '../src/drishti/rashi-drishti-calculator.js';
import { evaluateJaimini } from '../src/jaimini-calculator.js';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1, BirthChart, PlanetPosition } from '@vedica/astrology-core';
import { calculateCharaDasha } from '@vedica/dasha-engine';

describe('Jaimini Engine Tests (personal-jaimini-v1)', () => {
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

  it('calculates 7 Chara Karakas correctly by degree rank with evidence', () => {
    const karakas = calculateCharaKarakas(sampleBirthChart, '7_KARAKA');
    expect(karakas).toHaveLength(7);

    expect(karakas[0].role).toBe('AK');
    expect(karakas[0].planet).toBe('Sun');
    expect(karakas[0].evidence?.assignedRole).toBe('AK');
    expect(karakas[0].evidence?.rank).toBe(1);

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

  it('calculates 8 Chara Karakas correctly including Rahu with 30°-deg treatment', () => {
    const karakas = calculateCharaKarakas(sampleBirthChart, '8_KARAKA');
    expect(karakas).toHaveLength(8);
    // Rahu is at 15° Taurus -> 30 - 15 = 15° effective degree
    const rahu = karakas.find((k) => k.planet === 'Rahu');
    expect(rahu).toBeDefined();
    expect(rahu?.evidence?.effectiveDegree).toBe(15);
  });

  it('calculates Karakamsha analysis with evidence', () => {
    const karakas = calculateCharaKarakas(sampleBirthChart, '7_KARAKA');
    const km = analyzeKarakamsha(sampleBirthChart, karakas);

    expect(km.atmakarakaPlanet).toBe('Sun');
    expect(km.karakamshaSign).toBeDefined();
    expect(km.karakamshaHouseFromLagna).toBeGreaterThanOrEqual(1);
    expect(km.karakamshaHouseFromLagna).toBeLessThanOrEqual(12);
    expect(km.evidence.reasoning).toContain('Atmakaraka is Sun');
  });

  it('calculates 12 Arudha Padas with classical exception jump rules and evidence', () => {
    const padas = calculateArudhaPadas(sampleBirthChart);
    expect(padas).toHaveLength(12);

    const al = padas.find((p) => p.code === 'AL');
    expect(al).toBeDefined();
    expect(al?.evidence.houseNumber).toBe(1);

    const ul = padas.find((p) => p.code === 'UL');
    expect(ul).toBeDefined();
    expect(ul?.evidence.houseNumber).toBe(12);
  });

  it('calculates Jaimini Rashi Drishti sign aspects with evidence', () => {
    const drishti = calculateRashiDrishti(sampleBirthChart);
    expect(drishti).toHaveLength(12);

    const aries = drishti.find((d) => d.sign.id === 1);
    expect(aries?.signType).toBe('MOVABLE');
    expect(aries?.aspectingSigns.map((s) => s.id)).toEqual([5, 8, 11]);
    expect(aries?.evidence.reasoning).toContain('MOVABLE sign');

    const taurus = drishti.find((d) => d.sign.id === 2);
    expect(taurus?.signType).toBe('FIXED');
    expect(taurus?.aspectingSigns.map((s) => s.id)).toEqual([4, 7, 10]);

    const gemini = drishti.find((d) => d.sign.id === 3);
    expect(gemini?.signType).toBe('DUAL');
    expect(gemini?.aspectingSigns.map((s) => s.id)).toEqual([6, 9, 12]);
  });

  it('evaluates complete Jaimini report in personal-jaimini-v1 format', () => {
    const report = evaluateJaimini(sampleBirthChart);
    expect(report.profileVersion).toBe('personal-jaimini-v1');
    expect(report.scheme).toBe('7_KARAKA');
    expect(report.charaKarakas).toHaveLength(7);
    expect(report.karakamsha).toBeDefined();
    expect(report.arudhaPadas).toHaveLength(12);
    expect(report.rashiDrishti).toHaveLength(12);
    expect(report.yogas).toBeDefined();
  });

  it('verifies cross-engine isolation: Jaimini does not mutate original BirthChart', () => {
    const originalChartJson = JSON.stringify(sampleBirthChart);
    evaluateJaimini(sampleBirthChart);
    expect(JSON.stringify(sampleBirthChart)).toBe(originalChartJson);
  });

  it('golden regression test for Rakshit Jain birth chart (1996-09-23 23:00 IST, Panipat)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1996-09-23', timeOfBirth: '23:00:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 29.38747, longitude: 76.96825, name: 'Panipat', timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const jaimini = evaluateJaimini(chart, '7_KARAKA');
    expect(jaimini.profileVersion).toBe('personal-jaimini-v1');

    // 1. Chara Karakas
    const ak = jaimini.charaKarakas.find((k) => k.role === 'AK');
    expect(ak?.planet).toBe('Mercury');
    expect(ak?.sign.name).toBe('Leo');

    const amk = jaimini.charaKarakas.find((k) => k.role === 'AmK');
    expect(amk?.planet).toBe('Venus');

    const bk = jaimini.charaKarakas.find((k) => k.role === 'BK');
    expect(bk?.planet).toBe('Moon');

    // 2. Karakamsha
    expect(jaimini.karakamsha.atmakarakaPlanet).toBe('Mercury');
    expect(jaimini.karakamsha.karakamshaSign.name).toBe('Scorpio');

    // 3. Arudha Lagna (AL) & Upapada (UL)
    const al = jaimini.arudhaPadas.find((a) => a.code === 'AL');
    expect(al?.sign.name).toBe('Libra');

    const ul = jaimini.arudhaPadas.find((a) => a.code === 'UL');
    expect(ul?.sign.name).toBe('Virgo');

    // 4. Chara Dasha
    const charaDasha = calculateCharaDasha(chart, new Date('1996-09-23T23:00:00+05:30'));
    expect(charaDasha.profileVersion).toBe('personal-jaimini-v1');
    expect(charaDasha.periods).toHaveLength(12);
    expect(charaDasha.periods[0].rashiName).toBe('Gemini');
    expect(charaDasha.periods[0].antardashas).toHaveLength(12);
  });
});
