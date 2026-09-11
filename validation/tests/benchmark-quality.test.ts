import { describe, it, expect } from 'vitest';
import {
  assessBenchmarkSuiteQuality,
  auditBenchmarkCases,
  loadChartBenchmarkCases,
} from '../src/index.js';

describe('Phase 21 Benchmark Suite Quality Engine (BENCHMARK_QUALITY_V1)', () => {
  it('should assess benchmark suite quality deterministically', () => {
    const cases = loadChartBenchmarkCases();
    const quality = assessBenchmarkSuiteQuality(cases);

    expect(quality.profileVersion).toBe('BENCHMARK_QUALITY_V1');
    expect(quality.qualityScore).toBeGreaterThanOrEqual(0);
    expect(quality.qualityScore).toBeLessThanOrEqual(100);
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(quality.classification);
    expect(quality.factors.length).toBe(8);
    expect(quality.limitations.length).toBeGreaterThan(0);
  });

  it('should perform structured benchmark case audit', () => {
    const cases = loadChartBenchmarkCases();
    const audit = auditBenchmarkCases(cases);

    expect(audit.summary.totalCases).toBe(7);
    expect(audit.summary.verifiedCases).toBeGreaterThanOrEqual(1);
    expect(audit.auditRecords.length).toBe(7);

    const case001Audit = audit.auditRecords.find((r) => r.caseId === 'CASE-001');
    expect(case001Audit).toBeDefined();
    expect(case001Audit?.verificationStatus).toBe('VERIFIED');
    expect(case001Audit?.referenceAvailability).toBe('COMPLETE');
  });
});
