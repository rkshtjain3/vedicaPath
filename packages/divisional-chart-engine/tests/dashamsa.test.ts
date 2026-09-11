import { describe, expect, it } from 'vitest';
import {
  calculateDashamsaPosition,
  getDashamsaStartSign,
  isOddSign,
} from '../src/calculators/dashamsa-calculator.js';
import {
  calculateDivisionalChart,
  compareRashiAndDashamsa,
} from '../src/charts/divisional-chart-engine.js';
import { calculateCareerCrossChartFacts } from '../src/career-cross-chart/career-cross-chart.ts';
import { BirthChart } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';

describe('D10 Dashamsa Calculator & Career Cross-Chart Engine', () => {
  it('correctly classifies odd vs even signs', () => {
    expect(isOddSign(1)).toBe(true); // Aries
    expect(isOddSign(2)).toBe(false); // Taurus
    expect(isOddSign(3)).toBe(true); // Gemini
    expect(isOddSign(4)).toBe(false); // Cancer
    expect(isOddSign(5)).toBe(true); // Leo
    expect(isOddSign(6)).toBe(false); // Virgo
    expect(isOddSign(7)).toBe(true); // Libra
    expect(isOddSign(8)).toBe(false); // Scorpio
    expect(isOddSign(9)).toBe(true); // Sagittarius
    expect(isOddSign(10)).toBe(false); // Capricorn
    expect(isOddSign(11)).toBe(true); // Aquarius
    expect(isOddSign(12)).toBe(false); // Pisces
  });

  it('correctly calculates D10 starting sign for odd and even signs', () => {
    expect(getDashamsaStartSign(1)).toBe(1); // Aries starts at Aries (1st)
    expect(getDashamsaStartSign(2)).toBe(10); // Taurus starts at Capricorn (9th)
    expect(getDashamsaStartSign(3)).toBe(3); // Gemini starts at Gemini (1st)
    expect(getDashamsaStartSign(4)).toBe(12); // Cancer starts at Pisces (9th)
    expect(getDashamsaStartSign(5)).toBe(5); // Leo starts at Leo (1st)
    expect(getDashamsaStartSign(6)).toBe(2); // Virgo starts at Taurus (9th)
    expect(getDashamsaStartSign(7)).toBe(7); // Libra starts at Libra (1st)
    expect(getDashamsaStartSign(8)).toBe(4); // Scorpio starts at Cancer (9th)
    expect(getDashamsaStartSign(9)).toBe(9); // Sagittarius starts at Sagittarius (1st)
    expect(getDashamsaStartSign(10)).toBe(6); // Capricorn starts at Virgo (9th)
    expect(getDashamsaStartSign(11)).toBe(11); // Aquarius starts at Aquarius (1st)
    expect(getDashamsaStartSign(12)).toBe(8); // Pisces starts at Scorpio (9th)
  });

  it('handles division boundary cases without overflow or undefined signs', () => {
    // 0° Aries -> Div 1 -> Aries
    const pos0 = calculateDashamsaPosition(0.0);
    expect(pos0.sign.name).toBe('Aries');
    expect(pos0.divisionNumber).toBe(1);

    // 2° 59' 59.99" Aries -> Div 1 -> Aries
    const posEps = calculateDashamsaPosition(2.999999);
    expect(posEps.sign.name).toBe('Aries');
    expect(posEps.divisionNumber).toBe(1);

    // 3.0° Aries -> Div 2 -> Taurus
    const posDiv2 = calculateDashamsaPosition(3.0);
    expect(posDiv2.sign.name).toBe('Taurus');
    expect(posDiv2.divisionNumber).toBe(2);

    // 29° 59' 59.99" Aries -> Div 10 -> Capricorn
    const posDiv10 = calculateDashamsaPosition(29.999999);
    expect(posDiv10.sign.name).toBe('Capricorn');
    expect(posDiv10.divisionNumber).toBe(10);

    // 0° Taurus (Even sign) -> Div 1 -> Capricorn (9th sign)
    const posTau0 = calculateDashamsaPosition(30.0);
    expect(posTau0.sign.name).toBe('Capricorn');
    expect(posTau0.divisionNumber).toBe(1);

    // 3.0° Taurus -> Div 2 -> Aquarius
    const posTau3 = calculateDashamsaPosition(33.0);
    expect(posTau3.sign.name).toBe('Aquarius');
    expect(posTau3.divisionNumber).toBe(2);

    // 29.999999° Taurus -> Div 10 -> Libra
    const posTau29 = calculateDashamsaPosition(59.999999);
    expect(posTau29.sign.name).toBe('Libra');
    expect(posTau29.divisionNumber).toBe(10);
  });

  it('transforms full D1 birth chart into D10 Dashamsa chart with whole sign houses', () => {
    const dummyChart: BirthChart = {
      input: {
        birthTime: { dateOfBirth: '1990-01-01', timeOfBirth: '10:30', timezone: 'Asia/Kolkata' },
        location: { displayName: 'Delhi', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      },
      utcInstant: { isoString: '1990-01-01T05:00:00Z', epochMs: 631170000000 },
      calculationProfile: { ayanamsa: 'LAHIRI', houseSystem: 'WHOLE_SIGN' } as any,
      ayanamsaValue: 23.7,
      lagna: {
        longitude: 325.5, // Aquarius 25.5° -> Odd sign (starts at Aquarius). 25.5 / 3.0 = div 9 (Aquarius + 8 = Libra)
        sign: { id: 11, name: 'Aquarius', sanskritName: 'Kumbha', ruler: 'Saturn' },
        degreeInSign: 25.5,
        formattedDegree: '25° 30\' 00"',
        nakshatra: { id: 25, name: 'Purva Bhadrapada', ruler: 'Jupiter', pada: 2 },
      },
      moonSign: { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' },
      birthNakshatra: { id: 26, name: 'Uttara Bhadrapada', ruler: 'Saturn', pada: 1 },
      planets: [
        {
          planet: 'Sun',
          longitude: 256.0, // Sagittarius 16.0°
          sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' },
          degreeInSign: 16.0,
          formattedDegree: '16° 00\' 00"',
          nakshatra: { id: 20, name: 'Purva Ashadha', ruler: 'Venus', pada: 1 },
          isRetrograde: false,
          speed: 1.0,
        },
        {
          planet: 'Moon',
          longitude: 335.0, // Pisces 5.0°
          sign: { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' },
          degreeInSign: 5.0,
          formattedDegree: '05° 00\' 00"',
          nakshatra: { id: 26, name: 'Uttara Bhadrapada', ruler: 'Saturn', pada: 1 },
          isRetrograde: false,
          speed: 13.0,
        },
        {
          planet: 'Mars',
          longitude: 220.0, // Scorpio 10.0°
          sign: { id: 8, name: 'Scorpio', sanskritName: 'Vrishchika', ruler: 'Mars' },
          degreeInSign: 10.0,
          formattedDegree: '10° 00\' 00"',
          nakshatra: { id: 17, name: 'Anuradha', ruler: 'Saturn', pada: 3 },
          isRetrograde: false,
          speed: 0.6,
        },
        {
          planet: 'Mercury',
          longitude: 245.0, // Sagittarius 5.0°
          sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' },
          degreeInSign: 5.0,
          formattedDegree: '05° 00\' 00"',
          nakshatra: { id: 19, name: 'Mula', ruler: 'Ketu', pada: 2 },
          isRetrograde: false,
          speed: 1.2,
        },
        {
          planet: 'Jupiter',
          longitude: 95.0, // Cancer 5.0°
          sign: { id: 4, name: 'Cancer', sanskritName: 'Karka', ruler: 'Moon' },
          degreeInSign: 5.0,
          formattedDegree: '05° 00\' 00"',
          nakshatra: { id: 8, name: 'Pushya', ruler: 'Saturn', pada: 1 },
          isRetrograde: false,
          speed: 0.1,
        },
        {
          planet: 'Venus',
          longitude: 290.0, // Capricorn 20.0°
          sign: { id: 10, name: 'Capricorn', sanskritName: 'Makara', ruler: 'Saturn' },
          degreeInSign: 20.0,
          formattedDegree: '20° 00\' 00"',
          nakshatra: { id: 22, name: 'Shravana', ruler: 'Moon', pada: 4 },
          isRetrograde: false,
          speed: 1.1,
        },
        {
          planet: 'Saturn',
          longitude: 260.0, // Sagittarius 20.0°
          sign: { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' },
          degreeInSign: 20.0,
          formattedDegree: '20° 00\' 00"',
          nakshatra: { id: 20, name: 'Purva Ashadha', ruler: 'Venus', pada: 3 },
          isRetrograde: false,
          speed: 0.05,
        },
        {
          planet: 'Rahu',
          longitude: 310.0, // Aquarius 10.0°
          sign: { id: 11, name: 'Aquarius', sanskritName: 'Kumbha', ruler: 'Saturn' },
          degreeInSign: 10.0,
          formattedDegree: '10° 00\' 00"',
          nakshatra: { id: 24, name: 'Shatabhisha', ruler: 'Rahu', pada: 2 },
          isRetrograde: true,
          speed: -0.05,
        },
        {
          planet: 'Ketu',
          longitude: 130.0, // Leo 10.0°
          sign: { id: 5, name: 'Leo', sanskritName: 'Simha', ruler: 'Sun' },
          degreeInSign: 10.0,
          formattedDegree: '10° 00\' 00"',
          nakshatra: { id: 10, name: 'Magha', ruler: 'Ketu', pada: 4 },
          isRetrograde: true,
          speed: -0.05,
        },
      ],
    };

    const d10Chart = calculateDivisionalChart(dummyChart, 'D10');
    expect(d10Chart.type).toBe('D10');
    expect(d10Chart.division).toBe(10);
    expect(d10Chart.houses).toHaveLength(12);

    // House 1 matches D10 Lagna sign
    expect(d10Chart.houses[0].house).toBe(1);
    expect(d10Chart.houses[0].sign.id).toBe(d10Chart.ascendant.sign.id);

    // Factual D1 vs D10 comparison
    const analysis = analyzeChart(dummyChart);
    const comparison = compareRashiAndDashamsa(dummyChart, d10Chart, analysis);
    expect(comparison.items).toHaveLength(10); // Ascendant + 9 Planets
    expect(comparison.items[0].entity).toBe('Ascendant');
    expect(typeof comparison.items[0].sameD1D10Sign).toBe('boolean');

    // Career Cross-Chart Facts
    const careerCrossChart = calculateCareerCrossChartFacts(dummyChart, d10Chart, analysis);
    expect(careerCrossChart.d1TenthHouse.sign.name).toBeDefined();
    expect(careerCrossChart.d10TenthHouse.sign.name).toBeDefined();
    expect(careerCrossChart.crossChartPlanets.length).toBeGreaterThan(0);
    expect(careerCrossChart.crossChartPlanets[0].whyEvidence.length).toBeGreaterThan(0);
  });
});
