import { describe, expect, it, beforeEach } from 'vitest';
import {
  ShadbalaBenchmarkStore,
  computeInputFingerprint,
  computeReferenceHash,
  FullBenchmarkExport,
} from '../src/shadbala-jhora/store.js';
import { SHADBALA_JHORA_BENCHMARK_CASES } from '../src/shadbala-jhora/benchmark-cases.js';

describe('Phase 13C — Shadbala Benchmark Store & Data Integrity', () => {
  let store: ShadbalaBenchmarkStore;

  beforeEach(() => {
    store = new ShadbalaBenchmarkStore();
  });

  it('computes consistent input fingerprints for benchmark cases', () => {
    const case1 = SHADBALA_JHORA_BENCHMARK_CASES[0];
    const fp1 = computeInputFingerprint(case1);
    const fp2 = computeInputFingerprint(case1);

    expect(fp1).toBe(fp2);
    expect(fp1.length).toBe(16);
  });

  it('computes deterministic reference hashes for user-entered values', () => {
    const ref1 = { Sun: { uchchaBala: 30.0, digBala: 45.5 } };
    const ref2 = { Sun: { digBala: 45.5, uchchaBala: 30.0 } };

    const hash1 = computeReferenceHash(ref1);
    const hash2 = computeReferenceHash(ref2);

    expect(hash1).toBe(hash2);
  });

  it('strictly treats unentered/empty reference fields as NOT_VALIDATED without converting to zero', async () => {
    const caseId = SHADBALA_JHORA_BENCHMARK_CASES[0].id;
    store.saveReferenceData(caseId, true, {
      Sun: { uchchaBala: 30.0 }, // Ojayugma Bala, Dig Bala, etc. omitted
    });

    const evalResult = await store.evaluateCaseWithStore(caseId);

    // Only uchchaBala should be compared
    expect(evalResult.comparisonResult.components.length).toBe(1);
    expect(evalResult.comparisonResult.components[0].component).toBe('UCHCHA_BALA');
    expect(evalResult.comparisonResult.validationStatus).toBe('PARTIALLY_VALIDATED');
  });

  it('evaluates PASS when entered reference value is within tolerance', async () => {
    const caseId = SHADBALA_JHORA_BENCHMARK_CASES[0].id;
    // Sun Naisargika Bala is fixed classical constant 60.0 Virupas
    store.saveReferenceData(caseId, true, {
      Sun: { naisargikaBala: 60.0 },
    });

    const evalResult = await store.evaluateCaseWithStore(caseId);
    const comp = evalResult.comparisonResult.components.find((c) => c.component === 'NAISARGIKA_BALA');

    expect(comp).toBeDefined();
    expect(comp?.result).toBe('PASS');
    expect(evalResult.comparisonResult.overallResult).toBe('PASS');
  });

  it('evaluates FAIL when entered reference value exceeds tolerance', async () => {
    const caseId = SHADBALA_JHORA_BENCHMARK_CASES[0].id;
    // Sun Naisargika Bala expected = 40.0 (actual is 60.0, diff = 20.0 > 0.05 tolerance)
    store.saveReferenceData(caseId, true, {
      Sun: { naisargikaBala: 40.0 },
    });

    const evalResult = await store.evaluateCaseWithStore(caseId);
    const comp = evalResult.comparisonResult.components.find((c) => c.component === 'NAISARGIKA_BALA');

    expect(comp?.result).toBe('FAIL');
    expect(evalResult.comparisonResult.overallResult).toBe('FAIL');
  });

  it('exports and imports benchmark JSON payload faithfully', () => {
    const caseId = SHADBALA_JHORA_BENCHMARK_CASES[0].id;
    store.saveReferenceData(caseId, true, { Sun: { naisargikaBala: 60.0 } }, 'FORMULA_VARIANT', 'Test note');

    const exported = store.exportData();
    expect(exported.exportVersion).toBe('1.0.0');
    expect(exported.benchmarks[caseId]).toBeDefined();

    const newStore = new ShadbalaBenchmarkStore();
    const importRes = newStore.importData(exported);

    expect(importRes.importedCount).toBeGreaterThan(0);
    const restored = newStore.getStoredCaseData(caseId);
    expect(restored?.investigationCause).toBe('FORMULA_VARIANT');
    expect(restored?.investigationNotes).toBe('Test note');
  });
});
