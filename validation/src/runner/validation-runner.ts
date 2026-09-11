import { AstrologyCalculationEngine } from '@vedica/astrology-core';
import {
  AstrologyBenchmark,
  ValidationItemResult,
  ValidationReport,
  ValidationStatus,
} from '../types/validation.js';

export async function validateBenchmark(
  benchmark: AstrologyBenchmark,
  engine: AstrologyCalculationEngine,
  toleranceDegree: number = 0.05
): Promise<ValidationReport> {
  const items: ValidationItemResult[] = [];

  if (benchmark.status === 'NOT_VALIDATED' || !benchmark.expected) {
    return {
      benchmarkId: benchmark.id,
      description: benchmark.description,
      overallStatus: 'NOT_VALIDATED',
      toleranceDegree,
      items: [],
      summary: `Benchmark ${benchmark.id} is marked as NOT_VALIDATED. Missing expected comparison data.`,
    };
  }

  const birthChart = await engine.calculateBirthChart({
    birthTime: {
      dateOfBirth: benchmark.input.dateOfBirth,
      timeOfBirth: benchmark.input.timeOfBirth,
      timezone: benchmark.input.timezone,
    },
    location: {
      latitude: benchmark.input.latitude,
      longitude: benchmark.input.longitude,
      name: benchmark.input.locationName || 'Benchmark Location',
      timezone: benchmark.input.timezone,
    },
  });

  let overallPassed = true;

  // Validate Ascendant / Lagna
  if (benchmark.expected.ascendant) {
    const expAsc = benchmark.expected.ascendant;
    const calcAscSignName =
      typeof birthChart.lagna.sign === 'string'
        ? birthChart.lagna.sign
        : (birthChart.lagna.sign as any).name;
    const calcAscDegree = birthChart.lagna.degreeInSign;

    const signPassed = calcAscSignName.toLowerCase() === expAsc.sign.toLowerCase();
    items.push({
      field: 'Ascendant Sign',
      expected: expAsc.sign,
      calculated: calcAscSignName,
      passed: signPassed,
      formattedOutput: `Ascendant Sign\nExpected:\n${expAsc.sign}\nActual:\n${calcAscSignName}\nStatus:\n${signPassed ? 'PASS' : 'FAIL'}`,
    });

    const diffDegree = Math.abs(calcAscDegree - expAsc.longitude);
    const degPassed = diffDegree <= toleranceDegree;
    items.push({
      field: 'Ascendant Longitude',
      expected: `${expAsc.longitude.toFixed(4)}°`,
      calculated: `${calcAscDegree.toFixed(4)}°`,
      difference: diffDegree,
      tolerance: toleranceDegree,
      passed: degPassed,
      formattedOutput: `Ascendant Longitude\nExpected:\n${expAsc.longitude.toFixed(4)}°\nActual:\n${calcAscDegree.toFixed(4)}°\nDifference:\n${diffDegree.toFixed(4)}°\nTolerance:\n${toleranceDegree.toFixed(4)}°\nStatus:\n${degPassed ? 'PASS' : 'FAIL'}`,
    });

    if (!signPassed || !degPassed) overallPassed = false;
  }

  // Validate Planets
  if (benchmark.expected.planets) {
    for (const [planetName, expPlanet] of Object.entries(benchmark.expected.planets)) {
      const calcPlanet = birthChart.planets.find(
        (p) => p.planet.toLowerCase() === planetName.toLowerCase()
      );

      if (!calcPlanet) {
        items.push({
          field: `${planetName} Presence`,
          expected: 'Present',
          calculated: 'Missing',
          passed: false,
          formattedOutput: `${planetName}\nStatus:\nFAIL (Not computed by engine)`,
        });
        overallPassed = false;
        continue;
      }

      const calcPlanetSignName =
        typeof calcPlanet.sign === 'string'
          ? calcPlanet.sign
          : (calcPlanet.sign as any).name;

      // 1. Sign
      const signPassed = calcPlanetSignName.toLowerCase() === expPlanet.sign.toLowerCase();
      items.push({
        field: `${planetName} Sign`,
        expected: expPlanet.sign,
        calculated: calcPlanetSignName,
        passed: signPassed,
        formattedOutput: `${planetName} Sign\nExpected:\n${expPlanet.sign}\nActual:\n${calcPlanetSignName}\nStatus:\n${signPassed ? 'PASS' : 'FAIL'}`,
      });

      // 2. Longitude Degree
      const expDegree = expPlanet.longitude;
      const calcDegree = calcPlanet.degreeInSign;
      const diffDegree = Math.abs(calcDegree - expDegree);
      const degPassed = diffDegree <= toleranceDegree;
      items.push({
        field: `${planetName} Longitude`,
        expected: `${expDegree.toFixed(4)}°`,
        calculated: `${calcDegree.toFixed(4)}°`,
        difference: diffDegree,
        tolerance: toleranceDegree,
        passed: degPassed,
        formattedOutput: `${planetName} Longitude\nExpected:\n${expDegree.toFixed(4)}°\nActual:\n${calcDegree.toFixed(4)}°\nDifference:\n${diffDegree.toFixed(4)}°\nTolerance:\n${toleranceDegree.toFixed(4)}°\nStatus:\n${degPassed ? 'PASS' : 'FAIL'}`,
      });

      // 3. Nakshatra
      if (expPlanet.nakshatra) {
        const nakName =
          typeof calcPlanet.nakshatra === 'string'
            ? calcPlanet.nakshatra
            : (calcPlanet.nakshatra as any).nakshatra || (calcPlanet.nakshatra as any).name;
        const nakPassed = nakName.toLowerCase() === expPlanet.nakshatra.toLowerCase();
        items.push({
          field: `${planetName} Nakshatra`,
          expected: expPlanet.nakshatra,
          calculated: nakName,
          passed: nakPassed,
          formattedOutput: `${planetName} Nakshatra\nExpected:\n${expPlanet.nakshatra}\nActual:\n${nakName}\nStatus:\n${nakPassed ? 'PASS' : 'FAIL'}`,
        });
        if (!nakPassed) overallPassed = false;
      }

      // 4. Pada
      if (expPlanet.pada !== undefined) {
        const padaVal = (calcPlanet.nakshatra as any).pada;
        const padaPassed = padaVal === expPlanet.pada;
        items.push({
          field: `${planetName} Pada`,
          expected: expPlanet.pada,
          calculated: padaVal,
          passed: padaPassed,
          formattedOutput: `${planetName} Pada\nExpected:\n${expPlanet.pada}\nActual:\n${padaVal}\nStatus:\n${padaPassed ? 'PASS' : 'FAIL'}`,
        });
        if (!padaPassed) overallPassed = false;
      }

      if (!signPassed || !degPassed) overallPassed = false;
    }
  }

  const finalStatus: ValidationStatus = overallPassed ? 'PASS' : 'FAIL';

  return {
    benchmarkId: benchmark.id,
    description: benchmark.description,
    overallStatus: finalStatus,
    toleranceDegree,
    items,
    summary: `Benchmark ${benchmark.id}: ${finalStatus} (${items.filter((i) => i.passed).length}/${items.length} checks passed)`,
  };
}
