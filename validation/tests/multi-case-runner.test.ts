import { describe, it, expect } from 'vitest';
import {
  loadChartBenchmarkCases,
  runMultiCaseChartBenchmark,
} from '../src/index.js';

describe('Phase 20 Multi-Case Benchmark Runner', () => {
  it('should run multi-case chart benchmark suite and compute aggregate summary metrics', async () => {
    const cases = loadChartBenchmarkCases();
    expect(cases.length).toBe(7);

    const summary = await runMultiCaseChartBenchmark(cases, 0.05);

    expect(summary.totalCases).toBe(7);
    expect(summary.casesWithReferenceData).toBeGreaterThanOrEqual(1);
    expect(summary.fullyReferencedCases).toBeGreaterThanOrEqual(1);
    expect(summary.passedCases).toBeGreaterThanOrEqual(1);
    expect(summary.caseResults.length).toBe(7);

    const case001Res = summary.caseResults.find((r) => r.benchmarkId === 'CASE-001');
    expect(case001Res).toBeDefined();
    expect(case001Res?.validationExecutionResult).toBe('PASS');
    expect(case001Res?.accuracyMetrics?.planetaryPassPercentage).toBe(100);

    const case002Res = summary.caseResults.find((r) => r.benchmarkId === 'CASE-002');
    expect(case002Res).toBeDefined();
    expect(case002Res?.validationExecutionResult).toBe('NOT_VALIDATED');
  }, 15000);
});
