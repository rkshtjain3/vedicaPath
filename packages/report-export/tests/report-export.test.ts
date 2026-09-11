import { describe, it, expect } from 'vitest';
import { buildPrintableReportViewModel } from '../src/index.js';

describe('Report Export Package', () => {
  const mockCalculationResult = {
    astrology: {
      birthTime: { dateOfBirth: '1996-09-23', timeOfBirth: '14:30:00' },
      location: { name: 'New Delhi, India', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      lagna: { sign: { id: 9, name: 'Sagittarius' }, longitude: 245.5 },
      planets: [
        { planet: 'Sun', sign: { id: 6, name: 'Virgo' }, house: 10, longitude: 162.1 },
        { planet: 'Jupiter', sign: { id: 9, name: 'Sagittarius' }, house: 1, longitude: 250.3 },
      ],
    },
    divisionalCharts: {
      d9: {
        ascendant: { sign: { id: 1, name: 'Aries' }, absoluteLongitude: 10 },
        planets: { Sun: { sign: { id: 5, name: 'Leo' } } },
      },
      d10: {
        ascendant: { sign: { id: 10, name: 'Capricorn' }, absoluteLongitude: 275 },
        planets: { Sun: { sign: { id: 10, name: 'Capricorn' } } },
      },
    },
    audit: {
      inputFingerprint: 'TEST_FINGERPRINT_123',
      reproducibilityHash: 'TEST_HASH_456',
      resolvedUTC: '1996-09-23T09:00:00.000Z',
    },
    numerology: {
      lifePath: 3,
      birthday: 5,
      attitude: 8,
      personalYear: 1,
    },
  };

  it('transforms calculation result into valid PrintableReportViewModel', () => {
    const vm = buildPrintableReportViewModel(mockCalculationResult, { fullName: 'Rakshit Jain' });

    expect(vm.profile.fullName).toBe('Rakshit Jain');
    expect(vm.profile.dateOfBirth).toBe('1996-09-23');
    expect(vm.profile.locationName).toBe('New Delhi, India');
    expect(vm.config.ayanamsha).toContain('Lahiri');
    expect(vm.charts.d1.ascendantSign).toBe('Sagittarius');
    expect(vm.charts.d9.chartType).toBe('D9');
    expect(vm.charts.d10.chartType).toBe('D10');
    expect(vm.numerology.lifePath).toBe(3);
    expect(vm.numerology.hasNameNumerology).toBe(false);
    expect(vm.numerology.note).toContain('no name was provided');
    expect(vm.audit.inputFingerprint).toBe('TEST_FINGERPRINT_123');
    expect(vm.audit.reproducibilityHash).toBe('TEST_HASH_456');
  });

  it('correctly extracts finalNumber when numerology values are calculation result objects', () => {
    const objectBasedResult = {
      ...mockCalculationResult,
      numerology: {
        lifePath: { title: 'Life Path Number', inputValues: {}, formulaSteps: [], finalNumber: 7, isMasterNumber: false },
        birthday: { title: 'Birthday Number', inputValues: {}, formulaSteps: [], finalNumber: 5, isMasterNumber: false },
        attitude: { title: 'Attitude Number', inputValues: {}, formulaSteps: [], finalNumber: 3, isMasterNumber: false },
        personalYear: { title: 'Personal Year', inputValues: {}, formulaSteps: [], finalNumber: 9, isMasterNumber: false },
        nameAnalysis: {
          expressionNumber: { finalNumber: 11, isMasterNumber: true },
          soulUrgeNumber: { finalNumber: 2, isMasterNumber: false },
          personalityNumber: { finalNumber: 9, isMasterNumber: false },
        },
      },
    };

    const vm = buildPrintableReportViewModel(objectBasedResult, { fullName: 'Steve Jobs' });
    expect(vm.numerology.lifePath).toBe(7);
    expect(vm.numerology.birthday).toBe(5);
    expect(vm.numerology.attitude).toBe(3);
    expect(vm.numerology.personalYear).toBe(9);
    expect(vm.numerology.hasNameNumerology).toBe(true);
    expect(vm.numerology.expressionNumber).toBe(11);
    expect(vm.numerology.soulUrgeNumber).toBe(2);
    expect(vm.numerology.personalityNumber).toBe(9);
  });
});
