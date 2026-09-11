import { describe, it, expect } from 'vitest';
import { calculateAngularDifference } from '@vedica/shared';
import { runJHoraBenchmark } from '../src/runner/jhora-runner.js';
import case001 from '../jhora-test-cases/case-001-normal-indian.json';
import case002 from '../jhora-test-cases/case-002-midnight-birth.json';
import case003 from '../jhora-test-cases/case-003-lagna-boundary.json';
import case004 from '../jhora-test-cases/case-004-nakshatra-boundary.json';
import case005 from '../jhora-test-cases/case-005-sign-boundary.json';
import case006 from '../jhora-test-cases/case-006-foreign-dst.json';
import case007 from '../jhora-test-cases/case-007-high-latitude.json';
import case008 from '../jhora-test-cases/case-008-historical-birth.json';
import case009 from '../jhora-test-cases/case-009-timezone-offset.json';
import case010 from '../jhora-test-cases/case-010-longitudinal-variance.json';

describe('JHora Natal Chart Benchmark Suite', () => {
  it('correctly calculates 0° / 360° circular angular differences', () => {
    expect(calculateAngularDifference(359.9, 0.1)).toBeCloseTo(0.2, 4);
    expect(calculateAngularDifference(0.1, 359.9)).toBeCloseTo(0.2, 4);
    expect(calculateAngularDifference(359.98, 0.02)).toBeCloseTo(0.04, 4);
    expect(calculateAngularDifference(180, 180)).toBe(0);
    expect(calculateAngularDifference(0, 360)).toBe(0);
  });

  it('runs CASE-001 (Normal Indian Birth) against JHora expected values', async () => {
    const result = await runJHoraBenchmark(case001 as any);
    expect(result.status).toBe('PASS');
    expect(result.passed).toBe(true);
    expect(result.details.length).toBeGreaterThan(0);
  });

  it('handles unvalidated benchmark cases cleanly without failing suite', async () => {
    const unvalidatedCases = [
      case002,
      case003,
      case004,
      case005,
      case006,
      case007,
      case008,
      case009,
      case010,
    ];

    for (const c of unvalidatedCases) {
      const res = await runJHoraBenchmark(c as any);
      expect(res.status).toBe('NOT_VALIDATED');
      expect(res.passed).toBe(true);
    }
  });
});
