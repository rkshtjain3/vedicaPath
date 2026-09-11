import { describe, it, expect } from 'vitest';
import {
  buildChartViewModelFromD1,
  buildChartViewModelFromDivisional,
  buildChartViewModel,
  getPlanetAbbreviation,
  formatDegree,
} from '../src/index.js';

describe('Chart Renderer Package', () => {
  const mockD1Chart = {
    lagna: {
      sign: { id: 5, name: 'Leo' },
      longitude: 132.5,
    },
    planets: [
      {
        planet: 'Sun',
        longitude: 135.2,
        sign: { id: 5, name: 'Leo' },
        house: 1,
        isRetrograde: false,
        isCombust: false,
        nakshatra: { name: 'Purva Phalguni', pada: 1 },
      },
      {
        planet: 'Jupiter',
        longitude: 260.4,
        sign: { id: 9, name: 'Sagittarius' },
        house: 5,
        isRetrograde: true,
        isCombust: false,
      },
    ],
  };

  const mockDivisionalChart = {
    ascendant: {
      sign: { id: 1, name: 'Aries' },
      absoluteLongitude: 12.3,
    },
    planets: {
      Sun: {
        sign: { id: 1, name: 'Aries' },
        absoluteLongitude: 5.1,
      },
      Moon: {
        sign: { id: 4, name: 'Cancer' },
        absoluteLongitude: 95.2,
      },
    },
  };

  it('correctly maps planet abbreviations', () => {
    expect(getPlanetAbbreviation('Sun')).toBe('Su');
    expect(getPlanetAbbreviation('Moon')).toBe('Mo');
    expect(getPlanetAbbreviation('Ascendant')).toBe('As');
    expect(getPlanetAbbreviation('Rahu')).toBe('Ra');
  });

  it('formats decimal degrees to degree/minute/second string', () => {
    expect(formatDegree(12.5)).toBe("12° 30' 0\"");
  });

  it('builds D1 ChartViewModel correctly with Leo Lagna', () => {
    const vm = buildChartViewModelFromD1(mockD1Chart, 'NORTH_INDIAN');
    expect(vm.chartType).toBe('D1');
    expect(vm.ascendantSign).toBe('Leo');
    expect(vm.ascendantSignId).toBe(5);
    expect(vm.houses).toHaveLength(12);

    // House 1 should be Leo (5)
    expect(vm.houses[0].sign).toBe('Leo');
    expect(vm.houses[0].signId).toBe(5);
    expect(vm.houses[0].planets).toHaveLength(1);
    expect(vm.houses[0].planets[0].planet).toBe('Sun');

    // House 5 should be Sagittarius (9)
    expect(vm.houses[4].sign).toBe('Sagittarius');
    expect(vm.houses[4].signId).toBe(9);
    expect(vm.houses[4].planets).toHaveLength(1);
    expect(vm.houses[4].planets[0].planet).toBe('Jupiter');
    expect(vm.houses[4].planets[0].retrograde).toBe(true);
  });

  it('builds Divisional ChartViewModel (D9) correctly', () => {
    const vm = buildChartViewModelFromDivisional(mockDivisionalChart, 'D9', 'SOUTH_INDIAN');
    expect(vm.chartType).toBe('D9');
    expect(vm.style).toBe('SOUTH_INDIAN');
    expect(vm.ascendantSign).toBe('Aries');
    expect(vm.ascendantSignId).toBe(1);
    expect(vm.planets).toHaveLength(2);
  });

  it('handles fallback graceful build when calculation result is empty', () => {
    const vm = buildChartViewModel(null, 'D1');
    expect(vm.chartType).toBe('D1');
    expect(vm.ascendantSign).toBe('Aries');
    expect(vm.houses).toHaveLength(12);
  });
});
