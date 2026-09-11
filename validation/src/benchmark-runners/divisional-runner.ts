import { BenchmarkCase, ComponentComparisonResult } from '@vedica/benchmark-store';
import { DivisionalChart } from '@vedica/divisional-chart-engine';

export function runDivisionalBenchmark(
  testCase: BenchmarkCase,
  d9?: DivisionalChart,
  d10?: DivisionalChart
): ComponentComparisonResult[] {
  const results: ComponentComparisonResult[] = [];
  const ref = testCase.referenceValues?.divisionalCharts;

  if (!ref) {
    return results; // No reference data
  }

  // Helper to validate a divisional chart
  const validateChart = (chartRef: Record<string, any> | undefined, chart: DivisionalChart | undefined, chartName: string) => {
    if (!chartRef || !chart) return;

    if (chartRef.lagnaSign !== undefined) {
      const actualLagnaSign = chart.ascendant?.sign?.name;
      results.push({
        planetOrKey: `${chartName} Lagna`,
        field: 'sign',
        expectedValue: chartRef.lagnaSign,
        actualValue: actualLagnaSign || '',
        passed: actualLagnaSign === chartRef.lagnaSign
      });
    }

    if (chartRef.planetarySigns) {
      for (const [planetName, expectedSign] of Object.entries(chartRef.planetarySigns)) {
        const planet = (chart.planets as any)[planetName];
        if (planet) {
          const actualSign = planet.sign?.name || '';
          results.push({
            planetOrKey: `${chartName} ${planetName}`,
            field: 'sign',
            expectedValue: expectedSign as string,
            actualValue: actualSign,
            passed: actualSign === expectedSign
          });
        }
      }
    }
  };

  validateChart(ref.d9, d9, 'D9');
  validateChart(ref.d10, d10, 'D10');

  return results;
}
