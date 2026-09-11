import { describe, it, expect } from 'vitest';
import { calculateHoraPosition } from '../src/calculators/hora-calculator.js';
import { calculateDrekkanaPosition } from '../src/calculators/drekkana-calculator.js';
import { calculateSaptamsaPosition } from '../src/calculators/saptamsa-calculator.js';
import { calculateDwadashamsaPosition } from '../src/calculators/dwadashamsa-calculator.js';
import { calculateTrimsamsaPosition } from '../src/calculators/trimsamsa-calculator.js';
import { calculateDivisionalChart } from '../src/charts/divisional-chart-engine.js';
import { BirthChart } from '@vedica/astrology-core';

describe('D2 Hora Calculator', () => {
  it('calculates D2 Hora correctly for odd signs', () => {
    // Aries (Odd): 0-15 deg -> Leo (5), 15-30 deg -> Cancer (4)
    const pos1 = calculateHoraPosition(5); // 5 deg Aries
    expect(pos1.sign.id).toBe(5); // Leo

    const pos2 = calculateHoraPosition(20); // 20 deg Aries
    expect(pos2.sign.id).toBe(4); // Cancer
  });

  it('calculates D2 Hora correctly for even signs', () => {
    // Taurus (Even): 0-15 deg -> Cancer (4), 15-30 deg -> Leo (5)
    const pos1 = calculateHoraPosition(35); // 5 deg Taurus (35 deg)
    expect(pos1.sign.id).toBe(4); // Cancer

    const pos2 = calculateHoraPosition(50); // 20 deg Taurus (50 deg)
    expect(pos2.sign.id).toBe(5); // Leo
  });
});

describe('D3 Drekkana Calculator', () => {
  it('calculates D3 Drekkana correctly across all 3 decans', () => {
    // Aries (1): 0-10 deg -> Aries (1), 10-20 deg -> Leo (5), 20-30 deg -> Sagittarius (9)
    const pos1 = calculateDrekkanaPosition(5); // 1st decan
    expect(pos1.sign.id).toBe(1);

    const pos2 = calculateDrekkanaPosition(15); // 2nd decan (5th from Aries)
    expect(pos2.sign.id).toBe(5);

    const pos3 = calculateDrekkanaPosition(25); // 3rd decan (9th from Aries)
    expect(pos3.sign.id).toBe(9);
  });
});

describe('D7 Saptamsa Calculator', () => {
  it('calculates D7 Saptamsa for odd sign', () => {
    // Aries (Odd): starts from Aries (1)
    const pos1 = calculateSaptamsaPosition(1); // 1st saptamsa (0 - 4.28 deg) -> Aries (1)
    expect(pos1.sign.id).toBe(1);

    const pos2 = calculateSaptamsaPosition(5); // 2nd saptamsa (4.28 - 8.57 deg) -> Taurus (2)
    expect(pos2.sign.id).toBe(2);
  });

  it('calculates D7 Saptamsa for even sign', () => {
    // Taurus (Even): 7th from Taurus is Scorpio (8)
    const pos1 = calculateSaptamsaPosition(31); // 1 deg Taurus -> Scorpio (8)
    expect(pos1.sign.id).toBe(8);
  });
});

describe('D12 Dwadashamsa Calculator', () => {
  it('calculates D12 Dwadashamsa correctly', () => {
    // 30 / 12 = 2.5 deg per Dwadashamsa
    // Aries (1): 0 - 2.5 deg -> Aries (1), 2.5 - 5 deg -> Taurus (2)
    const pos1 = calculateDwadashamsaPosition(1); // 1 deg Aries
    expect(pos1.sign.id).toBe(1);

    const pos2 = calculateDwadashamsaPosition(3.5); // 3.5 deg Aries
    expect(pos2.sign.id).toBe(2);

    const pos3 = calculateDwadashamsaPosition(28); // 28 deg Aries -> 12th Dwadashamsa -> Pisces (12)
    expect(pos3.sign.id).toBe(12);
  });
});

describe('D30 Trimsamsa Calculator', () => {
  it('calculates D30 Trimsamsa for odd sign (Aries)', () => {
    // Odd sign limits: 5 (Mars=Aries), +5=10 (Saturn=Aquarius), +8=18 (Jupiter=Sagittarius), +7=25 (Mercury=Gemini), +5=30 (Venus=Libra)
    expect(calculateTrimsamsaPosition(2).sign.id).toBe(1); // Aries
    expect(calculateTrimsamsaPosition(7).sign.id).toBe(11); // Aquarius
    expect(calculateTrimsamsaPosition(14).sign.id).toBe(9); // Sagittarius
    expect(calculateTrimsamsaPosition(20).sign.id).toBe(3); // Gemini
    expect(calculateTrimsamsaPosition(27).sign.id).toBe(7); // Libra
  });

  it('calculates D30 Trimsamsa for even sign (Taurus)', () => {
    // Even sign limits: 5 (Venus=Taurus), +7=12 (Mercury=Virgo), +8=20 (Jupiter=Pisces), +5=25 (Saturn=Capricorn), +5=30 (Mars=Scorpio)
    expect(calculateTrimsamsaPosition(32).sign.id).toBe(2); // Taurus
    expect(calculateTrimsamsaPosition(38).sign.id).toBe(6); // Virgo
    expect(calculateTrimsamsaPosition(45).sign.id).toBe(12); // Pisces
    expect(calculateTrimsamsaPosition(52).sign.id).toBe(10); // Capricorn
    expect(calculateTrimsamsaPosition(57).sign.id).toBe(8); // Scorpio
  });
});

describe('Divisional Chart Engine Orchestration', () => {
  it('supports D2, D3, D7, D12, D30 divisional charts', () => {
    const mockChart: BirthChart = {
      profileVersion: 'v1',
      ayanamsaName: 'Lahiri',
      ayanamsaValue: 23.85,
      ascendant: {
        rashi: { id: 1, name: 'Aries', ruler: 'Mars', element: 'Fire', modality: 'Movable' },
        degreesInRashi: 15,
        totalLongitude: 15,
        nakshatra: { name: 'Bharani', lord: 'Venus', pad: 1 },
      },
      planets: [
        {
          planet: 'Sun',
          longitude: 10,
          rashi: { id: 1, name: 'Aries', ruler: 'Mars', element: 'Fire', modality: 'Movable' },
          degreesInRashi: 10,
          nakshatra: { name: 'Ashwini', lord: 'Ketu', pad: 3 },
          isRetrograde: false,
          speed: 1.0,
        },
      ],
      houses: [],
    };

    const d2 = calculateDivisionalChart(mockChart, 'D2');
    expect(d2.type).toBe('D2');
    expect(Object.keys(d2.planets)).toHaveLength(1);

    const d3 = calculateDivisionalChart(mockChart, 'D3');
    expect(d3.type).toBe('D3');

    const d7 = calculateDivisionalChart(mockChart, 'D7');
    expect(d7.type).toBe('D7');

    const d12 = calculateDivisionalChart(mockChart, 'D12');
    expect(d12.type).toBe('D12');

    const d30 = calculateDivisionalChart(mockChart, 'D30');
    expect(d30.type).toBe('D30');
  });
});
