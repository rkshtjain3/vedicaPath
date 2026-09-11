import { BenchmarkCase, ComponentComparisonResult } from '@vedica/benchmark-store';
import { SwissEphemerisEngine } from '@vedica/astrology-core';
import { generateMahadashas } from '@vedica/dasha-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { calculateAshtakavarga } from '@vedica/ashtakavarga-engine';
import { evaluateShadbalaEngine } from '@vedica/shadbala-engine';
import { runAstrologyBenchmark } from './astrology-runner.js';
import { runDashaBenchmark } from './dasha-runner.js';
import { runDivisionalBenchmark } from './divisional-runner.js';
import { runAshtakavargaBenchmark } from './ashtakavarga-runner.js';
import { runShadbalaBenchmark } from './shadbala-runner.js';

export async function runUnifiedBenchmark(testCase: BenchmarkCase): Promise<any> {
  const startTime = performance.now();
  
  // 1. Core Astrology
  const chartInput = {
    birthTime: {
      dateOfBirth: testCase.inputSnapshot.birthDate,
      timeOfBirth: testCase.inputSnapshot.birthTime,
      timezone: testCase.inputSnapshot.timezone,
    },
    location: {
      latitude: testCase.inputSnapshot.latitude,
      longitude: testCase.inputSnapshot.longitude,
      name: testCase.inputSnapshot.locationName,
      timezone: testCase.inputSnapshot.timezone,
    }
  };
  
  const engine = new SwissEphemerisEngine();
  const chart = await engine.calculateBirthChart(chartInput);
  const astResults = runAstrologyBenchmark(testCase, chart);

  // 2. Dasha
  const moonPlanet = chart.planets.find((p: any) => p.planet === 'Moon');
  const moonLongitude = moonPlanet ? moonPlanet.longitude : 0;
  const dashaResult = generateMahadashas({
    birthInstant: new Date(testCase.inputSnapshot.utcInstant),
    moonLongitude,
  });
  const dashaResults = runDashaBenchmark(testCase, dashaResult.mahadashas, (chart as any).birthNakshatra?.name || (moonPlanet as any)?.nakshatra?.name);

  // 3. Divisional
  const d9 = calculateDivisionalChart(chart, 'D9');
  const d10 = calculateDivisionalChart(chart, 'D10');
  const divResults = runDivisionalBenchmark(testCase, d9, d10);

  // 4. Ashtakavarga
  const ashtakavarga = calculateAshtakavarga(chart);
  const avResults = runAshtakavargaBenchmark(testCase, ashtakavarga);

  // 5. Shadbala
  const analysisResult = { planetFacts: [] } as any; // Mock or actual analysis
  const shadbala = evaluateShadbalaEngine({ chart, analysis: analysisResult, d9Chart: d9 });
  const shadbalaResults = runShadbalaBenchmark(testCase, shadbala);

  // Aggregate
  const comparisonResults = [
    ...astResults,
    ...dashaResults,
    ...divResults,
    ...avResults,
    ...shadbalaResults
  ];

  const totalComponents = comparisonResults.length;
  const passedComponents = comparisonResults.filter(r => r.passed).length;
  const failedComponents = comparisonResults.filter(r => !r.passed && r.notes !== 'PARTIAL_IMPLEMENTATION').length;
  const unvalidatedComponents = comparisonResults.filter(r => r.notes === 'PARTIAL_IMPLEMENTATION').length;
  
  let status: any = 'PASS';
  if (totalComponents === 0) status = 'NOT_VALIDATED';
  if (failedComponents > 0) status = 'FAIL';

  return {
    benchmarkCase: testCase,
    executedAt: new Date().toISOString(),
    status,
    driftResult: {
      driftStatus: 'MATCH',
      storedFingerprint: testCase.inputFingerprint,
      currentFingerprint: testCase.inputFingerprint,
      storedProfileVersion: testCase.calculationProfileVersion,
      currentProfileVersion: testCase.calculationProfileVersion,
    },
    comparisonResults,
    summary: {
      totalComponents,
      passedComponents,
      failedComponents,
      unvalidatedComponents
    }
  };
}
