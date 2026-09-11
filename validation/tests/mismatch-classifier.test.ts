import { describe, it, expect } from 'vitest';
import { classifyMismatch } from '../src/benchmark-runners/mismatch-classifier.js';
import { ComponentComparisonResult, BenchmarkCase } from '@vedica/benchmark-store';

describe('Mismatch Classification Engine', () => {
  const dummyCase: BenchmarkCase = {
    id: 'CASE-001',
    category: 'ASTROLOGY_CHART',
    title: 'Test Case',
    description: 'Test Case',
    status: 'NOT_VALIDATED',
    calculationProfileVersion: 'personal-vedic-v1',
    referenceSource: { software: 'JHora', version: '8.0' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inputSnapshot: {
      birthDate: '1990-01-01',
      birthTime: '12:00:00',
      timezone: 'Asia/Kolkata',
      utcInstant: '1990-01-01T06:30:00.000Z',
      latitude: 28.6139,
      longitude: 77.209,
      locationName: 'New Delhi',
      calculationProfileVersion: 'personal-vedic-v1',
    },
    inputFingerprint: 'fp',
    referenceValues: {},
    metadata: {},
  };

  it('should return no mismatch when all components pass', () => {
    const results: ComponentComparisonResult[] = [
      { planetOrKey: 'Sun', field: 'longitude', expectedValue: 10, actualValue: 10, difference: 0, passed: true },
    ];
    const res = classifyMismatch(results, dummyCase);
    expect(res.hasMismatch).toBe(false);
  });

  it('should classify AYANAMSHA mismatch when multiple planets have constant angular offset', () => {
    const results: ComponentComparisonResult[] = [
      { planetOrKey: 'Sun', field: 'longitude', expectedValue: 10.85, actualValue: 10.0, difference: 0.85, passed: false },
      { planetOrKey: 'Moon', field: 'longitude', expectedValue: 45.85, actualValue: 45.0, difference: 0.85, passed: false },
      { planetOrKey: 'Mars', field: 'longitude', expectedValue: 90.85, actualValue: 90.0, difference: 0.85, passed: false },
    ];

    const res = classifyMismatch(results, dummyCase);
    expect(res.hasMismatch).toBe(true);
    expect(res.candidates[0].type).toBe('AYANAMSHA');
    expect(res.candidates[0].likelihood).toBe('HIGH');
  });

  it('should classify TRUE_VS_MEAN_NODE when only Lunar Nodes fail', () => {
    const results: ComponentComparisonResult[] = [
      { planetOrKey: 'Sun', field: 'longitude', expectedValue: 10, actualValue: 10, difference: 0, passed: true },
      { planetOrKey: 'Rahu', field: 'longitude', expectedValue: 15.5, actualValue: 15.0, difference: 0.5, passed: false },
      { planetOrKey: 'Ketu', field: 'longitude', expectedValue: 195.5, actualValue: 195.0, difference: 0.5, passed: false },
    ];

    const res = classifyMismatch(results, dummyCase);
    expect(res.hasMismatch).toBe(true);
    expect(res.candidates[0].type).toBe('TRUE_VS_MEAN_NODE');
    expect(res.candidates[0].likelihood).toBe('HIGH');
  });

  it('should classify DIVISIONAL_MAPPING_ERROR when D1 passes but divisional signs differ', () => {
    const results: ComponentComparisonResult[] = [
      { planetOrKey: 'D9.Sun', field: 'sign', expectedValue: 'Aries', actualValue: 'Taurus', passed: false },
    ];

    const res = classifyMismatch(results, dummyCase);
    expect(res.hasMismatch).toBe(true);
    expect(res.candidates[0].type).toBe('DIVISIONAL_MAPPING_ERROR');
    expect(res.candidates[0].likelihood).toBe('HIGH');
  });
});
