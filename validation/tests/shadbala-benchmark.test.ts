import { describe, expect, it } from 'vitest';
import {
  ShadbalaJHoraBenchmark,
  BenchmarkCaseResult,
  ComponentComparisonResult,
  ShadbalaTolerancePolicy,
  DEFAULT_SHADBALA_TOLERANCE_POLICY,
} from '../src/shadbala-jhora/shadbala-jhora-benchmark-schema.js';
import { ShadbalaBenchmarkRunner } from '../src/shadbala-jhora/runner.js';
import { SHADBALA_JHORA_BENCHMARK_CASES } from '../src/shadbala-jhora/benchmark-cases.js';

describe('Phase 13B Validation Suite — Shadbala JHora Benchmark Framework', () => {
  it('loads 10 benchmark test cases (CASE-001 through CASE-010)', () => {
    expect(SHADBALA_JHORA_BENCHMARK_CASES.length).toBe(10);
    const ids = SHADBALA_JHORA_BENCHMARK_CASES.map((c) => c.id);
    expect(ids).toEqual([
      'CASE-001',
      'CASE-002',
      'CASE-003',
      'CASE-004',
      'CASE-005',
      'CASE-006',
      'CASE-007',
      'CASE-008',
      'CASE-009',
      'CASE-010',
    ]);
  });

  it('handles empty reference data strictly by returning NOT_VALIDATED without false success claims', async () => {
    const runner = new ShadbalaBenchmarkRunner();
    const case1 = SHADBALA_JHORA_BENCHMARK_CASES[0]; // CASE-001 with empty expected map

    const result = await runner.runBenchmarkCase(case1);

    expect(result.benchmarkId).toBe('CASE-001');
    expect(result.validationStatus).toBe('NOT_VALIDATED');
    expect(result.overallResult).toBe('NOT_VALIDATED');
    expect(result.components.length).toBe(0);
  });

  it('runs benchmark comparison against reference values and applies tolerance policy', async () => {
    const runner = new ShadbalaBenchmarkRunner({
      defaultVirupaTolerance: 0.05,
      componentOverrides: {},
    });

    const mockCase: ShadbalaJHoraBenchmark = {
      id: 'TEST-MOCK-001',
      description: 'Mock case for benchmark runner testing',
      source: {
        software: 'JHora',
        version: '8.0 Parashari Shadbala',
        settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
      },
      birthDetails: {
        date: '2000-01-01',
        time: '12:00:00',
        location: 'New Delhi, India',
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
      },
      expected: {
        Sun: {
          naisargikaBala: 60.0,
          uchchaBala: 30.0, // test tolerance
        },
      },
      validationStatus: 'PARTIALLY_VALIDATED',
    };

    const result = await runner.runBenchmarkCase(mockCase);

    expect(result.benchmarkId).toBe('TEST-MOCK-001');
    expect(result.components.length).toBeGreaterThan(0);

    const naisargikaComp = result.components.find((c) => c.component === 'NAISARGIKA_BALA');
    expect(naisargikaComp).toBeDefined();
    expect(naisargikaComp?.expected).toBe(60.0);
    expect(naisargikaComp?.actual).toBe(60.0);
    expect(naisargikaComp?.result).toBe('PASS');
  });

  it('detects component-level FAIL when expected value exceeds tolerance limit', async () => {
    const runner = new ShadbalaBenchmarkRunner({
      defaultVirupaTolerance: 0.05,
      componentOverrides: {},
    });

    const mockFailCase: ShadbalaJHoraBenchmark = {
      id: 'TEST-MOCK-FAIL',
      description: 'Mock case expecting failure',
      source: {
        software: 'JHora',
        settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL' },
      },
      birthDetails: {
        date: '2000-01-01',
        time: '12:00:00',
        location: 'New Delhi, India',
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
      },
      expected: {
        Sun: {
          naisargikaBala: 50.0, // Sun Naisargika Bala is fixed at 60.0, diff = 10.0 > 0.05 tolerance
        },
      },
      validationStatus: 'PARTIALLY_VALIDATED',
    };

    const result = await runner.runBenchmarkCase(mockFailCase);

    expect(result.overallResult).toBe('FAIL');
    const comp = result.components.find((c) => c.component === 'NAISARGIKA_BALA');
    expect(comp?.result).toBe('FAIL');
    expect(comp?.difference).toBe(10.0);
  });
});
