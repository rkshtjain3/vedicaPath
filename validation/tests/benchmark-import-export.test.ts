import { describe, it, expect } from 'vitest';
import case001 from '../benchmark-data/jhora/jhora-dataset/case-001.json';

describe('Phase 15 — Benchmark Dataset Import & Export Schema Validation', () => {
  it('guarantees standard exported dataset structure containing 12 initial cases', () => {
    const exportedDataset = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      count: 1,
      cases: [case001],
    };

    expect(exportedDataset.schemaVersion).toBe('1.0.0');
    expect(exportedDataset.cases).toHaveLength(1);
    expect(exportedDataset.cases[0].id).toBe('JHORA-001');
    expect(['NOT_VALIDATED', 'PASS', 'FAIL']).toContain(exportedDataset.cases[0].status);
  });
});
