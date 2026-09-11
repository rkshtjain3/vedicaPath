import {
  BenchmarkCase,
  BenchmarkSuiteQuality,
  QualityClassification,
  QualityFactorEvidence,
  VerificationStatus,
  calculateReferenceCompleteness,
} from '@vedica/benchmark-store';
import { loadChartBenchmarkCases } from '../astrology-chart/chart-benchmark-dataset.js';

export function assessBenchmarkSuiteQuality(casesInput?: BenchmarkCase[]): BenchmarkSuiteQuality {
  const cases = casesInput || loadChartBenchmarkCases();
  const total = cases.length;

  const factors: QualityFactorEvidence[] = [];
  const limitations: string[] = [];

  if (total === 0) {
    return {
      profileVersion: 'BENCHMARK_QUALITY_V1',
      evaluatedAt: new Date().toISOString(),
      qualityScore: 0,
      classification: 'LOW',
      factors: [
        {
          factor: 'Total Cases Registry',
          score: 0,
          weight: 100,
          status: 'DEFICIENT',
          details: 'No benchmark cases found in registry.',
        },
      ],
      limitations: ['Benchmark suite is empty.'],
    };
  }

  // Factor 1: Verified Cases Coverage (Weight: 25)
  const verifiedCount = cases.filter(
    (c) => (c.referenceSource?.verificationStatus as VerificationStatus) === 'VERIFIED'
  ).length;
  const verifiedScore = Math.round((verifiedCount / total) * 100);
  factors.push({
    factor: 'Verified Reference Coverage',
    score: verifiedScore,
    weight: 25,
    status: verifiedScore >= 80 ? 'SATISFIED' : verifiedScore >= 40 ? 'PARTIAL' : 'DEFICIENT',
    details: `${verifiedCount} out of ${total} cases contain independently verified external reference data.`,
  });

  if (verifiedCount < total) {
    limitations.push(
      `${total - verifiedCount} benchmark cases remain unverified or lack complete third-party reference data.`
    );
  }

  // Factor 2: Geographical & Hemispheric Diversity (Weight: 15)
  const southernCount = cases.filter((c) => (c.inputSnapshot?.latitude || 0) < 0).length;
  const uniqueTimezones = new Set(cases.map((c) => c.inputSnapshot?.timezone)).size;
  const geoScore = southernCount > 0 && uniqueTimezones >= 3 ? 100 : uniqueTimezones >= 2 ? 60 : 30;

  factors.push({
    factor: 'Geographical & Hemispheric Diversity',
    score: geoScore,
    weight: 15,
    status: geoScore >= 80 ? 'SATISFIED' : geoScore >= 50 ? 'PARTIAL' : 'DEFICIENT',
    details: `Dataset covers ${uniqueTimezones} distinct IANA timezones and ${southernCount} Southern Hemisphere cases.`,
  });

  if (southernCount === 0) {
    limitations.push('Dataset lacks Southern Hemisphere test cases.');
  }

  // Factor 3: DST Transition Coverage (Weight: 15)
  const hasDstSpring = cases.some((c) => c.id.includes('002') || (c.inputSnapshot?.timezone || '').includes('New_York'));
  const hasDstFall = cases.some((c) => c.id.includes('003') || (c.inputSnapshot?.timezone || '').includes('London'));
  const dstScore = hasDstSpring && hasDstFall ? 100 : hasDstSpring || hasDstFall ? 50 : 0;

  factors.push({
    factor: 'DST Transition Coverage',
    score: dstScore,
    weight: 15,
    status: dstScore >= 80 ? 'SATISFIED' : dstScore >= 50 ? 'PARTIAL' : 'DEFICIENT',
    details: `Spring DST non-existent time: ${hasDstSpring ? 'Covered' : 'Missing'}; Fall DST duplicate time: ${hasDstFall ? 'Covered' : 'Missing'}.`,
  });

  // Factor 4: Historical Timezone Coverage (Weight: 10)
  const historicalCount = cases.filter((c) => {
    const yr = parseInt((c.inputSnapshot?.birthDate || '2000').split('-')[0], 10);
    return yr < 1970;
  }).length;
  const histScore = historicalCount >= 1 ? 100 : 0;

  factors.push({
    factor: 'Historical Timezone Coverage',
    score: histScore,
    weight: 10,
    status: histScore >= 80 ? 'SATISFIED' : 'DEFICIENT',
    details: `${historicalCount} historical pre-1970 birth chart cases included.`,
  });

  // Factor 5: Longitude & Nakshatra Boundary Coverage (Weight: 10)
  const boundaryCount = cases.filter(
    (c) => c.id.includes('006') || c.id.includes('007') || c.category.includes('BOUNDARY')
  ).length;
  const boundaryScore = boundaryCount >= 2 ? 100 : boundaryCount === 1 ? 50 : 0;

  factors.push({
    factor: 'Boundary Sensitivity Coverage',
    score: boundaryScore,
    weight: 10,
    status: boundaryScore >= 80 ? 'SATISFIED' : boundaryScore >= 50 ? 'PARTIAL' : 'DEFICIENT',
    details: `${boundaryCount} cases specifically test sign boundary or nakshatra boundary positions.`,
  });

  // Factor 6: Divisional Chart Coverage (Weight: 10)
  const divCoveredCount = cases.filter((c) => {
    const comp = calculateReferenceCompleteness(c.referenceValues);
    return comp.divisionalCharts > 0;
  }).length;
  const divScore = Math.round((divCoveredCount / total) * 100);

  factors.push({
    factor: 'Divisional Chart Coverage (D1-D30)',
    score: divScore,
    weight: 10,
    status: divScore >= 80 ? 'SATISFIED' : divScore >= 30 ? 'PARTIAL' : 'DEFICIENT',
    details: `${divCoveredCount} out of ${total} cases contain reference divisional chart data.`,
  });

  // Factor 7: Vimshottari Dasha Coverage (Weight: 10)
  const dashaCoveredCount = cases.filter((c) => {
    const comp = calculateReferenceCompleteness(c.referenceValues);
    return comp.dasha > 0;
  }).length;
  const dashaScore = Math.round((dashaCoveredCount / total) * 100);

  factors.push({
    factor: 'Vimshottari Dasha Coverage',
    score: dashaScore,
    weight: 10,
    status: dashaScore >= 80 ? 'SATISFIED' : dashaScore >= 30 ? 'PARTIAL' : 'DEFICIENT',
    details: `${dashaCoveredCount} out of ${total} cases contain Vimshottari Dasha reference parameters.`,
  });

  // Factor 8: Reference Software Diversity (Weight: 5)
  const softwareSources = new Set(
    cases
      .map((c) => c.referenceSource?.sourceSoftware || c.referenceSource?.software)
      .filter((s) => s && s.trim() !== '')
  );
  const softScore = softwareSources.size >= 2 ? 100 : softwareSources.size === 1 ? 60 : 0;

  factors.push({
    factor: 'Reference Software Diversity',
    score: softScore,
    weight: 5,
    status: softScore >= 80 ? 'SATISFIED' : softScore >= 50 ? 'PARTIAL' : 'DEFICIENT',
    details: `${softwareSources.size} independent reference software system(s) identified in dataset (${Array.from(softwareSources).join(', ') || 'None'}).`,
  });

  // Compute Overall Weighted Score
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedScoreSum = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const qualityScore = Math.round(weightedScoreSum / totalWeight);

  let classification: QualityClassification = 'LOW';
  if (qualityScore >= 80) classification = 'HIGH';
  else if (qualityScore >= 50) classification = 'MEDIUM';

  limitations.push(
    'Benchmark suite quality score reflects test program maturity and reference coverage ONLY; it does not measure astrological accuracy or predictive validity.'
  );

  return {
    profileVersion: 'BENCHMARK_QUALITY_V1',
    evaluatedAt: new Date().toISOString(),
    qualityScore,
    classification,
    factors,
    limitations,
  };
}
