import { describe, expect, it, beforeEach } from 'vitest';
import {
  getBenchmarkStore,
  FileBenchmarkStore,
  computeInputFingerprint,
  computeReferenceHash,
} from '../src/shadbala-jhora/store/index.js';
import { SHADBALA_JHORA_BENCHMARK_CASES } from '../src/shadbala-jhora/benchmark-cases.js';

describe('Phase 13C.1 — BenchmarkStore Abstraction & Provider Tests', () => {
  let store: FileBenchmarkStore;

  beforeEach(() => {
    store = new FileBenchmarkStore();
  });

  it('provides a valid BenchmarkStore instance via getBenchmarkStore factory', () => {
    const factoryStore = getBenchmarkStore();
    expect(factoryStore).toBeDefined();
    expect(typeof factoryStore.listCases).toBe('function');
    expect(typeof factoryStore.updateReference).toBe('function');
  });

  it('FileBenchmarkStore correctly implements BenchmarkStore interface', async () => {
    const cases = await store.listCases('SHADBALA');
    expect(Array.isArray(cases)).toBe(true);
    expect(cases.length).toBe(10);
  });

  it('computes deterministic SHA-256 input fingerprints independent of storage provider', () => {
    const case1 = SHADBALA_JHORA_BENCHMARK_CASES[0];
    const fp1 = computeInputFingerprint(case1);
    const fp2 = computeInputFingerprint(case1);

    expect(fp1).toBe(fp2);
    expect(fp1.length).toBe(16);
  });

  it('computes deterministic reference hashes for user-entered values', () => {
    const refData = { Sun: { uchchaBala: 45.2, digBala: 30.0 } };
    const hash1 = computeReferenceHash(refData);
    const hash2 = computeReferenceHash(refData);

    expect(hash1).toBe(hash2);
  });

  it('saves and retrieves reference data cleanly through store methods', async () => {
    const saved = await store.updateReference({
      caseId: 'CASE-001',
      checklistConfirmed: true,
      referenceValues: { Sun: { naisargikaBala: 60.0 } },
      investigationCause: 'FORMULA_VARIANT',
      investigationNotes: 'Test note for store abstraction',
    });

    expect(saved.id).toBe('CASE-001');
    expect(saved.metadata.checklistConfirmed).toBe(true);

    const retrieved = await store.getCase('CASE-001');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.metadata.investigationCause).toBe('FORMULA_VARIANT');
  });

  it('exports portable benchmark JSON payload without machine-specific filesystem paths', async () => {
    const exported = await store.exportDataset('SHADBALA');
    expect(exported.schemaVersion).toBe('1.0.0');

    const jsonString = JSON.stringify(exported);
    expect(jsonString).not.toContain('/home/');
    expect(jsonString).not.toContain('C:\\');
  });
});
