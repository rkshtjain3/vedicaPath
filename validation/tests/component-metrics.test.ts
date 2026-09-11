import { describe, it, expect } from 'vitest';
import {
  computeCircularAngularDifference,
  calculateMedian,
  calculateRMS,
  runBirthChartBenchmark,
  getChartBenchmarkCaseById,
} from '../src/index.js';

describe('Phase 21 Component-Level Accuracy Metrics', () => {
  it('should correctly calculate circular angular difference across boundary (0° / 360°)', () => {
    expect(computeCircularAngularDifference(0.1, 359.9)).toBeCloseTo(0.2, 5);
    expect(computeCircularAngularDifference(359.9, 0.1)).toBeCloseTo(0.2, 5);
    expect(computeCircularAngularDifference(10, 15)).toBe(5);
  });

  it('should correctly calculate median angular difference', () => {
    expect(calculateMedian([0.01, 0.05, 0.02])).toBe(0.02);
    expect(calculateMedian([0.01, 0.02, 0.03, 0.04])).toBe(0.025);
  });

  it('should correctly calculate RMS angular difference', () => {
    const rms = calculateRMS([3, 4]); // Math.sqrt((9 + 16) / 2) = Math.sqrt(12.5) ~ 3.5355
    expect(rms).toBeCloseTo(3.5355339, 4);
  });

  it('should compute component-level metrics breakdown for CASE-001 benchmark run', async () => {
    const c001 = getChartBenchmarkCaseById('CASE-001');
    expect(c001).toBeDefined();

    if (c001) {
      const res = await runBirthChartBenchmark(c001, 0.05);
      expect(res.accuracyMetrics).toBeDefined();
      expect(res.accuracyMetrics?.componentBreakdown).toBeDefined();

      const breakdown = res.accuracyMetrics?.componentBreakdown;
      expect(breakdown?.planetary.comparisons).toBeGreaterThan(0);
      expect(breakdown?.planetary.medianAngularDifference).toBeGreaterThanOrEqual(0);
      expect(breakdown?.planetary.rmsAngularDifference).toBeGreaterThanOrEqual(0);
      expect(breakdown?.ascendant.signMatch).toBe(true);
      expect(breakdown?.nakshatra.nakshatraMatchRate).toBe(100);
      expect(breakdown?.divisional['D1'].passRate).toBe(100);
      expect(breakdown?.divisional['D9'].passRate).toBe(100);
      expect(breakdown?.dasha.birthNakshatraMatch).toBe(true);
    }
  }, 15000);
});
