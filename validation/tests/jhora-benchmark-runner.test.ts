import { describe, it, expect } from 'vitest';
import { runJHoraBenchmarkCase } from '../src/benchmark-runners/jhora-runner.js';
import case001 from '../benchmark-data/jhora/jhora-dataset/case-001.json';

describe('Phase 15 — Real JHora Benchmark Runner Integration Suite', () => {
  it('evaluates template JHora case as NOT_VALIDATED when no reference outputs are entered', async () => {
    const templateCase = { ...case001, referenceOutputs: {} };
    const res = await runJHoraBenchmarkCase(templateCase);
    expect(res.caseId).toBe('JHORA-001');
    expect(res.status).toBe('NOT_VALIDATED');
    expect(res.summary.notValidated).toBeGreaterThan(0);
    expect(res.summary.failed).toBe(0);
    expect(res.summary.passed).toBe(0);
  });

  it('evaluates PASS for matching reference outputs within 0.05° tolerance', async () => {
    // Generate actual output first
    const baseRun = await runJHoraBenchmarkCase(case001);
    const sunLong = baseRun.actualOutputs.astrology.planetaryLongitudes.Sun;

    const populatedCase = {
      ...case001,
      referenceOutputs: {
        astrology: {
          planetaryLongitudes: {
            Sun: sunLong + 0.02, // Within 0.05° tolerance
          },
        },
      },
    };

    const res = await runJHoraBenchmarkCase(populatedCase);
    const sunDetail = res.details.find((d) => d.component === 'Sun.longitude');
    expect(sunDetail).toBeDefined();
    expect(sunDetail?.status).toBe('PASS');
    expect(sunDetail?.difference).toBeCloseTo(0.02, 4);
  });

  it('evaluates FAIL when reference output differs beyond 0.05° tolerance', async () => {
    const baseRun = await runJHoraBenchmarkCase(case001);
    const sunLong = baseRun.actualOutputs.astrology.planetaryLongitudes.Sun;

    const populatedCase = {
      ...case001,
      referenceOutputs: {
        astrology: {
          planetaryLongitudes: {
            Sun: sunLong + 1.25, // Exceeds 0.05° tolerance
          },
        },
      },
    };

    const res = await runJHoraBenchmarkCase(populatedCase);
    expect(res.status).toBe('FAIL');
    const sunDetail = res.details.find((d) => d.component === 'Sun.longitude');
    expect(sunDetail?.status).toBe('FAIL');
    expect(sunDetail?.difference).toBeCloseTo(1.25, 4);
  });
});
