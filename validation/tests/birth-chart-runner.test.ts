import { describe, it, expect } from 'vitest';
import {
  computeCircularAngularDifference,
  runBirthChartBenchmark,
  loadChartBenchmarkCases,
} from '../src/index.js';

describe('Birth Chart Accuracy Validation Runner', () => {
  it('should correctly calculate circular angular difference across 0°/360° boundary', () => {
    expect(computeCircularAngularDifference(359.99, 0.01)).toBeCloseTo(0.02, 4);
    expect(computeCircularAngularDifference(0.01, 359.99)).toBeCloseTo(0.02, 4);
    expect(computeCircularAngularDifference(180, 185)).toBe(5);
    expect(computeCircularAngularDifference(10, 350)).toBe(20);
  });

  it('should run benchmark case and handle NOT_VALIDATED status when reference values are missing', async () => {
    const cases = loadChartBenchmarkCases();
    expect(cases.length).toBeGreaterThan(0);

    const testCase = cases.find((c) => c.id === 'CASE-002') || cases[1];
    const result = await runBirthChartBenchmark(testCase, 0.05);

    expect(result.benchmarkId).toBe(testCase.id);
    expect(result.overallResult).toBe('NOT_VALIDATED');
    expect(result.summary.unvalidatedComponents).toBeGreaterThan(0);
    expect(result.actualChartOutputs.ascendant).toBeDefined();
    expect(result.actualChartOutputs.planets.length).toBe(9);
  });

  it('should correctly mark components PASS when reference values match actual calculation', async () => {
    const cases = loadChartBenchmarkCases();
    const testCase = JSON.parse(JSON.stringify(cases[0]));

    // Inject exact reference values matching internal engine calculation
    testCase.referenceValues = {
      astrology: {
        ascendantLongitude: 104.9926,
        ascendantSign: 'Cancer',
        planetaryLongitudes: {
          Sun: 60.312,
          Moon: 40.15,
        },
      },
    };

    const result = await runBirthChartBenchmark(testCase, 0.05);
    expect(result.summary.passedComponents).toBeGreaterThan(0);
  });
});
