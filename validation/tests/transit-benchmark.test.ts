import { describe, it, expect } from 'vitest';
import { runTransitBenchmark, verifyTransitReproducibility } from '../src/runner/transit-runner.js';
import transitCase001 from '../transit-test-cases/transit-case-001.json';

describe('Transit Engine Ephemeris Reproducibility Suite', () => {
  it('runs TRANSIT-001 benchmark handling NOT_VALIDATED status', async () => {
    const res = await runTransitBenchmark(transitCase001 as any);
    expect(res.status).toBe('NOT_VALIDATED');
    expect(res.passed).toBe(true);
  });

  it('verifies exact planetary transit reproducibility across multiple runs', async () => {
    const testInstant = '2026-08-29T12:00:00.000Z';
    const isReproducible = await verifyTransitReproducibility(testInstant);
    expect(isReproducible).toBe(true);
  });
});
