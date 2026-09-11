import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { calculateAngularDifference } from '@vedica/shared';
import { JHoraBenchmarkCase, JHoraBenchmarkResult } from '../types/validation-types.js';

export async function runJHoraBenchmark(
  testCase: JHoraBenchmarkCase,
  tolerance: number = 0.05
): Promise<JHoraBenchmarkResult> {
  const details: JHoraBenchmarkResult['details'] = [];

  if (!testCase.expected || testCase.status === 'NOT_VALIDATED') {
    return {
      caseId: testCase.id,
      category: testCase.category,
      sourceType: testCase.sourceType,
      passed: true,
      status: 'NOT_VALIDATED',
      tolerance,
      details: [
        {
          field: 'case',
          expected: 'Verified JHora Output',
          actual: 'Unvalidated / Awaiting JHora Entry',
          passed: true,
        },
      ],
    };
  }

  const engine = new SwissEphemerisEngine();
  const birthChart = await engine.calculateBirthChart(
    {
      birthTime: {
        dateOfBirth: testCase.input.dateOfBirth,
        timeOfBirth: testCase.input.timeOfBirth,
        timezone: testCase.input.timezone,
      },
      location: {
        name: 'Benchmark Location',
        latitude: testCase.input.latitude,
        longitude: testCase.input.longitude,
        timezone: testCase.input.timezone,
      },
    },
    PERSONAL_VEDIC_V1
  );

  let overallPassed = true;

  // Compare Ascendant / Lagna
  if (testCase.expected.ascendant) {
    const expAsc = testCase.expected.ascendant.longitude;
    const actAsc = expAsc <= 30 ? birthChart.lagna.degreeInSign : birthChart.lagna.longitude;
    const diff = calculateAngularDifference(expAsc, actAsc);
    const passed = diff <= tolerance;
    if (!passed) overallPassed = false;

    details.push({
      field: 'Ascendant',
      expected: expAsc,
      actual: actAsc,
      difference: Math.round(diff * 10000) / 10000,
      passed,
    });
  }

  // Compare Planets
  if (testCase.expected.planets) {
    for (const [planetName, expData] of Object.entries(testCase.expected.planets)) {
      const actPlanet = birthChart.planets.find((p) => p.planet === planetName);
      if (!actPlanet) {
        overallPassed = false;
        details.push({
          field: `Planet [${planetName}]`,
          expected: expData.longitude,
          actual: 'MISSING',
          passed: false,
        });
        continue;
      }

      const actLon = expData.longitude <= 30 ? actPlanet.degreeInSign : actPlanet.longitude;
      const diff = calculateAngularDifference(expData.longitude, actLon);
      const passed = diff <= tolerance;
      if (!passed) overallPassed = false;

      details.push({
        field: `Planet [${planetName}]`,
        expected: expData.longitude,
        actual: actLon,
        difference: Math.round(diff * 10000) / 10000,
        passed,
      });

      if (expData.nakshatra && actPlanet.nakshatra) {
        const nakPassed = expData.nakshatra === actPlanet.nakshatra.name;
        if (!nakPassed) overallPassed = false;
        details.push({
          field: `Planet [${planetName}] Nakshatra`,
          expected: expData.nakshatra,
          actual: actPlanet.nakshatra.name,
          passed: nakPassed,
        });
      }
    }
  }

  return {
    caseId: testCase.id,
    category: testCase.category,
    sourceType: testCase.sourceType,
    passed: overallPassed,
    status: overallPassed ? 'PASS' : 'FAIL',
    tolerance,
    details,
  };
}
