import { describe, it, expect } from 'vitest';
import { isWithinAngularTolerance } from '../src/benchmark-runners/astrology-runner.js';
import { runDashaBenchmark } from '../src/benchmark-runners/dasha-runner.js';
import { BenchmarkCase } from '@vedica/benchmark-store';

describe('Cross Engine Benchmark Utilities', () => {
  describe('isWithinAngularTolerance', () => {
    it('handles exact matches', () => {
      expect(isWithinAngularTolerance(45.5, 45.5)).toBe(true);
    });

    it('handles regular differences within tolerance', () => {
      expect(isWithinAngularTolerance(45.5, 45.54, 0.05)).toBe(true);
      expect(isWithinAngularTolerance(45.5, 45.46, 0.05)).toBe(true);
    });

    it('handles regular differences outside tolerance', () => {
      expect(isWithinAngularTolerance(45.5, 45.6, 0.05)).toBe(false);
      expect(isWithinAngularTolerance(45.5, 45.4, 0.05)).toBe(false);
    });

    it('handles exact boundary matches', () => {
      expect(isWithinAngularTolerance(45.5, 45.55, 0.05)).toBe(true);
      expect(isWithinAngularTolerance(45.5, 45.45, 0.05)).toBe(true);
    });

    it('handles circular wraparound within tolerance', () => {
      expect(isWithinAngularTolerance(359.99, 0.01, 0.05)).toBe(true);
      expect(isWithinAngularTolerance(0.01, 359.99, 0.05)).toBe(true);
    });

    it('handles circular wraparound outside tolerance', () => {
      expect(isWithinAngularTolerance(359.9, 0.1, 0.05)).toBe(false);
    });
  });

  describe('Dasha Benchmark Runner', () => {
    it('returns empty array when no reference provided', () => {
      const mockCase = { id: 'test', referenceValues: {} } as any;
      const res = runDashaBenchmark(mockCase, [], 'Krittika');
      expect(res.length).toBe(0);
    });

    it('evaluates birth nakshatra correctly', () => {
      const mockCase = {
        id: 'test',
        referenceValues: {
          dasha: { birthNakshatra: 'Krittika' }
        }
      } as any;
      
      const resPass = runDashaBenchmark(mockCase, [], 'Krittika');
      expect(resPass[0].passed).toBe(true);

      const resFail = runDashaBenchmark(mockCase, [], 'Rohini');
      expect(resFail[0].passed).toBe(false);
    });
  });
});
