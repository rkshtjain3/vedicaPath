import { BenchmarkCase, ComponentComparisonResult } from '@vedica/benchmark-store';
import { BirthChart } from '@vedica/astrology-core';

export function isWithinAngularTolerance(expected: number, actual: number, tolerance = 0.05): boolean {
  const diff = Math.abs(expected - actual);
  const circularDiff = Math.min(diff, 360 - diff);
  return circularDiff <= tolerance;
}

export function runAstrologyBenchmark(
  testCase: BenchmarkCase,
  chart: BirthChart,
  tolerance = 0.05
): ComponentComparisonResult[] {
  const results: ComponentComparisonResult[] = [];
  const ref = testCase.referenceValues?.astrology;

  if (!ref) {
    return results; // No reference data for astrology
  }

  // Lagna Longitude
  if (ref.lagnaLongitude !== undefined) {
    const actual = chart.lagna?.longitude ?? 0;
    const diff = Math.min(Math.abs(ref.lagnaLongitude - actual), 360 - Math.abs(ref.lagnaLongitude - actual));
    const passed = diff <= tolerance;
    results.push({
      planetOrKey: 'Lagna',
      field: 'longitude',
      expectedValue: ref.lagnaLongitude,
      actualValue: actual,
      difference: diff,
      tolerance,
      passed,
    });
  }

  // Planetary Longitudes
  if (ref.planetaryLongitudes) {
    for (const [planetName, expectedLngRaw] of Object.entries(ref.planetaryLongitudes)) {
      const expectedLng = expectedLngRaw as number;
      const planet = chart.planets.find(p => p.planet === planetName);
      if (planet) {
        const actual = planet.longitude;
        const diff = Math.min(Math.abs(expectedLng - actual), 360 - Math.abs(expectedLng - actual));
        const passed = diff <= tolerance;
        results.push({
          planetOrKey: planetName,
          field: 'longitude',
          expectedValue: expectedLng,
          actualValue: actual,
          difference: diff,
          tolerance,
          passed,
        });
      }
    }
  }

  // Nakshatras
  if (ref.nakshatras) {
    for (const [planetName, expectedNakRaw] of Object.entries(ref.nakshatras)) {
      const expectedNak = expectedNakRaw as string;
      if (planetName === 'Lagna') {
         const actualNak = chart.lagna?.nakshatra?.name || '';
         const passed = actualNak === expectedNak;
         results.push({
           planetOrKey: 'Lagna',
           field: 'nakshatra',
           expectedValue: expectedNak,
           actualValue: actualNak,
           passed
         });
      } else {
        const planet = chart.planets.find(p => p.planet === planetName);
        if (planet) {
          const actualNak = planet.nakshatra?.name || '';
          const passed = actualNak === expectedNak;
          results.push({
            planetOrKey: planetName,
            field: 'nakshatra',
            expectedValue: expectedNak,
            actualValue: actualNak,
            passed
          });
        }
      }
    }
  }

  return results;
}
