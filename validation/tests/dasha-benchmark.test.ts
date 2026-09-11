import { describe, it, expect } from 'vitest';
import { runDashaBenchmark, verifyDashaBoundaryContinuity } from '../src/runner/dasha-runner.js';
import dashaCase001 from '../dasha-test-cases/dasha-case-001.json';

describe('Dasha Engine Benchmark & Boundary Suite', () => {
  it('runs DASHA-001 benchmark verification', () => {
    const res = runDashaBenchmark(dashaCase001 as any);
    expect(res.status).toBe('PASS');
    expect(res.passed).toBe(true);
  });

  it('verifies exact Dasha sub-period boundaries, zero gaps, zero overlaps, and 1ms continuity', () => {
    const birthInstant = new Date('1996-09-23T09:00:00.000Z');
    const moonLongitude = 285.5141; // Shravana 2nd pada

    const continuity = verifyDashaBoundaryContinuity(moonLongitude, birthInstant);
    expect(continuity.passed).toBe(true);
    expect(continuity.checks.every((c) => c.passed)).toBe(true);
  });
});
