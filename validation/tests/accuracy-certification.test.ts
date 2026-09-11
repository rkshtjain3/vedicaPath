import { describe, it, expect } from 'vitest';
import {
  loadChartBenchmarkCases,
  runBirthChartBenchmark,
  generateAccuracyCertification,
} from '../src/index.js';

describe('Phase 19 Accuracy Certification & Two-Stage Validation', () => {
  it('should run CASE-001 with real populated JHora reference data and pass with high precision', async () => {
    const cases = loadChartBenchmarkCases();
    const case001 = cases.find((c) => c.id === 'CASE-001');
    expect(case001).toBeDefined();

    const res = await runBirthChartBenchmark(case001!, 0.05);

    expect(res.referenceCoverageStatus).toBe('COMPLETE');
    expect(res.validationExecutionResult).toBe('PASS');
    expect(res.completeness.overallPercent).toBe(100);
    expect(res.accuracyMetrics).toBeDefined();
    expect(res.accuracyMetrics?.maxAngularDifference).toBeLessThan(0.01);
    expect(res.accuracyMetrics?.planetaryPassPercentage).toBe(100);
  });

  it('should detect configuration mismatch when reference ayanamsha conflicts with engine ayanamsha', async () => {
    const cases = loadChartBenchmarkCases();
    const caseCopy = JSON.parse(JSON.stringify(cases[0]));

    // Inject conflicting ayanamsha in reference settings
    caseCopy.referenceSource = {
      ...caseCopy.referenceSource,
      settings: { ayanamsha: 'Raman' },
    };

    const res = await runBirthChartBenchmark(caseCopy, 0.05);
    expect(res.validationExecutionResult).toBe('INCOMPARABLE_CONFIGURATION');
    expect(res.configurationMismatchNote).toContain('Configuration Mismatch');
  });

  it('should generate accuracy certification report for benchmark dataset', async () => {
    const cases = loadChartBenchmarkCases();
    const { summary, textReport } = await generateAccuracyCertification(cases, 0.05);

    expect(summary.totalCases).toBe(cases.length);
    expect(summary.externallyReferencedCases).toBeGreaterThanOrEqual(1);
    expect(summary.maxAngularDifference).toBeLessThan(0.05);
    expect(textReport).toContain('VEDICA CALCULATION ACCURACY CERTIFICATION');
    expect(textReport).toContain('Maximum Angular Difference');
  }, 15000);
});
