import { describe, expect, it } from 'vitest';
import {
  calculateNavamsaPosition,
  getNavamsaStartSign,
  getSignCategory,
} from '../src/calculators/navamsa-calculator.js';
import { calculateDivisionalChart, compareRashiAndNavamsa } from '../src/charts/divisional-chart-engine.js';
import { BirthChart } from '@vedica/astrology-core';

describe('D9 Navamsa Calculator & Sign Mapping Engine', () => {
  it('correctly classifies sign categories (Movable, Fixed, Dual)', () => {
    expect(getSignCategory(1)).toBe('MOVABLE'); // Aries
    expect(getSignCategory(4)).toBe('MOVABLE'); // Cancer
    expect(getSignCategory(7)).toBe('MOVABLE'); // Libra
    expect(getSignCategory(10)).toBe('MOVABLE'); // Capricorn

    expect(getSignCategory(2)).toBe('FIXED'); // Taurus
    expect(getSignCategory(5)).toBe('FIXED'); // Leo
    expect(getSignCategory(8)).toBe('FIXED'); // Scorpio
    expect(getSignCategory(11)).toBe('FIXED'); // Aquarius

    expect(getSignCategory(3)).toBe('DUAL'); // Gemini
    expect(getSignCategory(6)).toBe('DUAL'); // Virgo
    expect(getSignCategory(9)).toBe('DUAL'); // Sagittarius
    expect(getSignCategory(12)).toBe('DUAL'); // Pisces
  });

  it('correctly calculates D9 starting sign for each category', () => {
    expect(getNavamsaStartSign(1)).toBe(1); // Aries starts at Aries
    expect(getNavamsaStartSign(2)).toBe(10); // Taurus starts at Capricorn (9th)
    expect(getNavamsaStartSign(3)).toBe(7); // Gemini starts at Libra (5th)
    expect(getNavamsaStartSign(4)).toBe(4); // Cancer starts at Cancer (1st)
    expect(getNavamsaStartSign(5)).toBe(1); // Leo starts at Aries (9th)
    expect(getNavamsaStartSign(6)).toBe(10); // Virgo starts at Capricorn (5th)
  });

  it('handles boundary cases without overflow or undefined signs', () => {
    // 0° Aries -> Div 1 -> Aries (Mesha)
    const pos0 = calculateNavamsaPosition(0.0);
    expect(pos0.sign.name).toBe('Aries');
    expect(pos0.divisionNumber).toBe(1);

    // 3° 20' (3.333333°) Aries -> Div 2 -> Taurus
    const posBoundaryJustAfter = calculateNavamsaPosition(3.333334);
    expect(posBoundaryJustAfter.sign.name).toBe('Taurus');
    expect(posBoundaryJustAfter.divisionNumber).toBe(2);

    // 3° 19' 59" (3.3333°) Aries -> Div 1 -> Aries
    const posBoundaryJustBefore = calculateNavamsaPosition(3.3332);
    expect(posBoundaryJustBefore.sign.name).toBe('Aries');
    expect(posBoundaryJustBefore.divisionNumber).toBe(1);

    // 29° 59' 59.99" (29.999999°) Aries -> Div 9 -> Sagittarius
    const posLastDiv = calculateNavamsaPosition(29.999999);
    expect(posLastDiv.sign.name).toBe('Sagittarius');
    expect(posLastDiv.divisionNumber).toBe(9);
  });

  it('detects Vargottama positions accurately', () => {
    // 0.5° Aries D1 -> D9 Aries -> Vargottama
    const ariesPos = calculateNavamsaPosition(0.5);
    expect(ariesPos.sign.name).toBe('Aries');

    // 14.0° Taurus D1 -> D9 Aquarius (Taurus starts at Capricorn: 1=Cap, 2=Aqua, 3=Pis, 4=Aries, 5=Taurus)
    // 14.0° / 3.3333° = division 5 -> Capricorn + 4 = Taurus! (Vargottama!)
    // Let's verify 14.0° Taurus: degInSign = 14, 14 / (30/9) = 4.2 -> divIndex 4 -> divisionNumber 5.
    // Start sign Cap (10) + 4 = 14 -> 14 - 12 = 2 (Taurus). So 14° Taurus is Vargottama!
    const taurausPos = calculateNavamsaPosition(44.0); // 30 + 14 = 44°
    expect(taurausPos.sign.name).toBe('Taurus');
  });

  it('transforms full D1 birth chart into D9 Navamsa chart with whole sign houses', () => {
    const dummyChart: BirthChart = {
      input: {
        birthTime: { dateOfBirth: '1990-01-01', timeOfBirth: '10:30', timezone: 'Asia/Kolkata' },
        location: { displayName: 'Delhi', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      },
      utcInstant: { isoString: '1990-01-01T05:00:00Z', epochMs: 631170000000 },
      calculationProfile: { ayanamsa: 'LAHIRI', houseSystem: 'WHOLE_SIGN' } as any,
      ayanamsaValue: 23.7,
      lagna: {
        longitude: 325.5, // Aquarius 25.5° -> Fixed sign (Aquarius starts at Libra = 7). 25.5 / 3.333 = divIndex 7 -> div 8 -> Libra + 7 = Taurus!
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
      ],
    };

    const d9Chart = calculateDivisionalChart(dummyChart, 'D9');
    expect(d9Chart.type).toBe('D9');
    expect(d9Chart.division).toBe(9);
    expect(d9Chart.houses).toHaveLength(12);

    // Verify Lagna house (House 1) matches D9 Lagna sign
    expect(d9Chart.houses[0].house).toBe(1);
    expect(d9Chart.houses[0].sign.id).toBe(d9Chart.ascendant.sign.id);

    // Verify Varga comparison
    const comparison = compareRashiAndNavamsa(dummyChart, d9Chart);
    expect(comparison.items.length).toBeGreaterThan(0);
    expect(comparison.items[0].entity).toBe('Ascendant');
  });
});
