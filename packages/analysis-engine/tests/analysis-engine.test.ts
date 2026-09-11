import { describe, expect, it } from 'vitest';
import { BirthChart } from '@vedica/astrology-core';
import {
  analyzeChart,
  calculateAngularDistance,
  calculatePlanetDignity,
  calculateVedicAspects,
  detectConjunctions,
  PERSONAL_ANALYSIS_V1,
} from '../src/index.js';

describe('Chart Analysis Engine (@vedica/analysis-engine)', () => {
  // Mock birth chart (Lagna in Sagittarius 26.56°, Moon in Capricorn 15.51°, Sun in Virgo 6.80°, etc.)
  const mockChart: any = {
    birthTime: { dateOfBirth: '1996-09-23', timeOfBirth: '14:30:00', timezone: 'Asia/Kolkata' },
    location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
    calculationProfile: { version: 'personal-vedic-v1' },
    lagna: {
      degreeInSign: 26.5611,
      longitude: 266.5611,
      sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' },
    },
    planets: [
      {
        planet: 'Sun',
        longitude: 156.7995,
        sign: { id: 6, name: 'Virgo', sanskritName: 'Kanya', ruler: 'Mercury' },
        degreeInSign: 6.7995,
        speed: 0.98,
        isRetrograde: false,
        house: 10,
        nakshatra: { name: 'Uttara Phalguni', pada: 4, ruler: 'Sun' },
      },
      {
        planet: 'Moon',
        longitude: 285.5141,
        sign: { id: 10, name: 'Capricorn', sanskritName: 'Makara', ruler: 'Saturn' },
        degreeInSign: 15.5141,
        speed: 13.2,
        isRetrograde: false,
        house: 2,
        nakshatra: { name: 'Shravana', pada: 2, ruler: 'Moon' },
      },
      {
        planet: 'Mars',
        longitude: 95.2,
        sign: { id: 4, name: 'Cancer', sanskritName: 'Karka', ruler: 'Moon' },
        degreeInSign: 5.2,
        speed: 0.6,
        isRetrograde: false,
        house: 8,
        nakshatra: { name: 'Pushya', pada: 1, ruler: 'Saturn' },
      },
      {
        planet: 'Mercury',
        longitude: 160.1,
        sign: { id: 6, name: 'Virgo', sanskritName: 'Kanya', ruler: 'Mercury' },
        degreeInSign: 10.1,
        speed: 1.2,
        isRetrograde: false,
        house: 10,
        nakshatra: { name: 'Hasta', pada: 1, ruler: 'Moon' },
      },
      {
        planet: 'Jupiter',
        longitude: 250.4,
        sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' },
        degreeInSign: 10.4,
        speed: 0.1,
        isRetrograde: false,
        house: 1,
        nakshatra: { name: 'Mula', pada: 4, ruler: 'Ketu' },
      },
      {
        planet: 'Venus',
        longitude: 125.0,
        sign: { id: 5, name: 'Leo', sanskritName: 'Simha', ruler: 'Sun' },
        degreeInSign: 5.0,
        speed: 1.1,
        isRetrograde: false,
        house: 9,
        nakshatra: { name: 'Magha', pada: 2, ruler: 'Ketu' },
      },
      {
        planet: 'Saturn',
        longitude: 340.0,
        sign: { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' },
        degreeInSign: 10.0,
        speed: -0.05,
        isRetrograde: true,
        house: 4,
        nakshatra: { name: 'Uttara Bhadrapada', pada: 3, ruler: 'Saturn' },
      },
      {
        planet: 'Rahu',
        longitude: 170.0,
        sign: { id: 6, name: 'Virgo', sanskritName: 'Kanya', ruler: 'Mercury' },
        degreeInSign: 20.0,
        speed: -0.05,
        isRetrograde: true,
        house: 10,
        nakshatra: { name: 'Hasta', pada: 4, ruler: 'Moon' },
      },
      {
        planet: 'Ketu',
        longitude: 350.0,
        sign: { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' },
        degreeInSign: 20.0,
        speed: -0.05,
        isRetrograde: true,
        house: 4,
        nakshatra: { name: 'Revati', pada: 2, ruler: 'Mercury' },
      },
    ],
  };

  it('1. should calculate planet facts accurately', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);
    expect(res.planetFacts.length).toBe(9);

    const jupiterFact = res.planetFacts.find((p) => p.planet === 'Jupiter');
    expect(jupiterFact).toBeDefined();
    expect(jupiterFact?.house).toBe(1); // Sagittarius Lagna
    expect(jupiterFact?.sign).toBe('Sagittarius');
  });

  it('2. should calculate 12 house facts and house lords correctly', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);
    expect(res.houseFacts.length).toBe(12);

    // 1st house is Sagittarius -> Lord Jupiter
    expect(res.houseFacts[0].sign).toBe('Sagittarius');
    expect(res.houseFacts[0].lord).toBe('Jupiter');
    expect(res.houseFacts[0].occupied).toBe(true);

    // 10th house is Virgo -> Occupied by Sun, Mercury, Rahu
    expect(res.houseFacts[9].sign).toBe('Virgo');
    expect(res.houseFacts[9].planets).toContain('Sun');
    expect(res.houseFacts[9].planets).toContain('Mercury');
    expect(res.houseFacts[9].occupantCount).toBe(3);
  });

  it('3. should map house lord placements and dignities accurately', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);
    expect(res.houseLordFacts.length).toBe(12);

    // Lord of 1st house (Jupiter) is in 1st house (Sagittarius) -> Own Sign
    const lord1 = res.houseLordFacts.find((h) => h.house === 1);
    expect(lord1?.lord).toBe('Jupiter');
    expect(lord1?.lordHouse).toBe(1);
    expect(lord1?.dignity).toBe('OWN_SIGN');
  });

  it('4. should detect conjunctions within orb and prevent duplicate pairs', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);

    // Sun (156.8°) and Mercury (160.1°) diff = 3.3° <= 8° orb -> detected
    const sunMerc = res.conjunctions.find(
      (c) => c.planetA === 'Sun' && c.planetB === 'Mercury'
    );
    expect(sunMerc).toBeDefined();
    expect(sunMerc?.detected).toBe(true);
    expect(sunMerc?.longitudeDifference).toBeCloseTo(3.3, 1);

    // Ensure no reverse pair (Mercury, Sun)
    const mercSun = res.conjunctions.find(
      (c) => c.planetA === 'Mercury' && c.planetB === 'Sun'
    );
    expect(mercSun).toBeUndefined();
  });

  it('5. should calculate Vedic house aspects (7th, Mars 4/7/8, Jupiter 5/7/9, Saturn 3/7/10)', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);

    // Jupiter in House 1 -> aspects House 5, House 7, House 9
    const jupAspects = res.aspects.filter((a) => a.fromPlanet === 'Jupiter');
    expect(jupAspects.map((a) => a.toHouse)).toEqual([5, 7, 9]);

    // Mars in House 8 -> aspects House 11 (4th), House 2 (7th), House 3 (8th)
    const marsAspects = res.aspects.filter((a) => a.fromPlanet === 'Mars');
    expect(marsAspects.map((a) => a.toHouse)).toEqual([11, 2, 3]);

    // Saturn in House 4 -> aspects House 6 (3rd), House 10 (7th), House 1 (10th)
    const satAspects = res.aspects.filter((a) => a.fromPlanet === 'Saturn');
    expect(satAspects.map((a) => a.toHouse)).toEqual([6, 10, 1]);
  });

  it('6. should evaluate planetary dignities (Exaltation, Debilitation, Own Sign, Moolatrikona)', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);

    // Mars in Cancer (5.2°) -> Debilitated
    const marsDig = res.dignities.find((d) => d.planet === 'Mars');
    expect(marsDig?.primaryDignity).toBe('DEBILITATED');

    // Mercury in Virgo (10.1°) -> Exalted (Virgo up to 15°)
    const mercDig = res.dignities.find((d) => d.planet === 'Mercury');
    expect(mercDig?.primaryDignity).toBe('EXALTED');

    // Jupiter in Sagittarius (10.4°) -> Moolatrikona (0-10°) or Own Sign
    const jupDig = res.dignities.find((d) => d.planet === 'Jupiter');
    expect(jupDig?.primaryDignity).toBe('OWN_SIGN');
  });

  it('7. should evaluate combustion with retrograde thresholds', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);

    // Mercury (160.1°) & Sun (156.7995°) -> diff = 3.3005° <= 14° -> combust
    const mercComb = res.combustion.find((c) => c.planet === 'Mercury');
    expect(mercComb).toBeDefined();
    expect(mercComb?.isCombust).toBe(true);
    expect(mercComb?.distanceFromSun).toBeCloseTo(3.3, 1);
  });

  it('8. should evaluate initial Yogas with transparent condition breakdown', () => {
    const res = analyzeChart(mockChart, PERSONAL_ANALYSIS_V1);
    expect(res.yogas.length).toBe(24);

    // Budha-Aditya Yoga (Sun & Mercury conjunct in House 10)
    const budhaAditya = res.yogas.find((y) => y.id === 'BUDHA_ADITYA_YOGA');
    expect(budhaAditya?.detected).toBe(true);
    expect(budhaAditya?.conditions[0].result).toBe(true);

    // Gajakesari Yoga (Jupiter in House 1, Moon in House 2 -> diff = 12th house (not kendra))
    const gajakesari = res.yogas.find((y) => y.id === 'GAJAKESARI_YOGA');
    expect(gajakesari?.detected).toBe(false);
    expect(gajakesari?.conditions[0].result).toBe(false);
  });
});
