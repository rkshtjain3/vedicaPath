import { BenchmarkCase, RootCauseClassification } from '@vedica/benchmark-store';
import { ComponentComparisonResult } from '@vedica/benchmark-store';

export interface DiagnosticCandidate {
  category: RootCauseClassification;
  type: RootCauseClassification;
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string[];
  recommendedInvestigation: string;
}

export interface MismatchDiagnosticResult {
  hasMismatch: boolean;
  totalFailedComponents: number;
  candidates: DiagnosticCandidate[];
  summary: string;
}

export function classifyMismatch(
  comparisonResults: ComponentComparisonResult[],
  benchmarkCase: BenchmarkCase
): MismatchDiagnosticResult {
  const failedItems = comparisonResults.filter((r) => !r.passed);

  if (failedItems.length === 0) {
    return {
      hasMismatch: false,
      totalFailedComponents: 0,
      candidates: [],
      summary: 'No mismatches detected in comparison results.',
    };
  }

  const candidates: DiagnosticCandidate[] = [];

  // 1. Ayanamsha Mismatch
  const angularDiffs = failedItems
    .filter((r) => r.field === 'longitude' && typeof r.difference === 'number')
    .map((r) => r.difference as number);

  if (angularDiffs.length >= 3) {
    const avgDiff = angularDiffs.reduce((a, b) => a + b, 0) / angularDiffs.length;
    const isConstantOffset = angularDiffs.every((d) => Math.abs(d - avgDiff) < 0.05);

    if (isConstantOffset) {
      candidates.push({
        category: 'AYANAMSHA',
        type: 'AYANAMSHA',
        likelihood: 'HIGH',
        evidence: [
          `All ${angularDiffs.length} failed planet longitudes differ by a constant angular offset (~${avgDiff.toFixed(4)}°).`,
          `Engine ayanamsha: ${benchmarkCase.inputSnapshot?.ayanamsha || 'Lahiri'}.`,
        ],
        recommendedInvestigation: 'Verify reference software Ayanamsha selection (Lahiri, Raman, Krishnamurti, etc.) against calculation settings.',
      });
    }
  }

  // 2. True Node vs Mean Node
  const nodeFails = failedItems.filter((r) => r.planetOrKey === 'Rahu' || r.planetOrKey === 'Ketu');
  const nonNodeFails = failedItems.filter((r) => r.planetOrKey !== 'Rahu' && r.planetOrKey !== 'Ketu');

  if (nodeFails.length > 0 && nonNodeFails.length === 0) {
    candidates.push({
      category: 'TRUE_VS_MEAN_NODE',
      type: 'TRUE_VS_MEAN_NODE',
      likelihood: 'HIGH',
      evidence: [
        'Only Lunar Nodes (Rahu/Ketu) exhibit difference while all primary planets pass.',
        'Possible True Node vs. Mean Node convention mismatch.',
      ],
      recommendedInvestigation: 'Check whether reference software uses True Node or Mean Node calculation.',
    });
  }

  // 3. Timezone / DST Resolution
  const moonFail = failedItems.find((r) => r.planetOrKey === 'Moon' && r.field === 'longitude');
  const saturnFail = failedItems.find((r) => r.planetOrKey === 'Saturn' && r.field === 'longitude');

  if (moonFail && !saturnFail) {
    candidates.push({
      category: 'INPUT_TIMEZONE',
      type: 'INPUT_TIMEZONE',
      likelihood: 'MEDIUM',
      evidence: [
        `Fast-moving Moon longitude differs (${moonFail.difference?.toFixed(4)}°) while slow outer planets match.`,
        `Input timezone: ${benchmarkCase.inputSnapshot?.timezone || 'Unknown'}.`,
      ],
      recommendedInvestigation: 'Verify input birth time UTC offset and DST status at birth location.',
    });
  }

  // 4. Divisional Chart Mapping Error
  const divFails = failedItems.filter((r) => r.planetOrKey.includes('.'));
  const d1Fails = failedItems.filter((r) => !r.planetOrKey.includes('.'));

  if (divFails.length > 0 && d1Fails.length === 0) {
    candidates.push({
      category: 'DIVISIONAL_MAPPING_ERROR',
      type: 'DIVISIONAL_MAPPING_ERROR',
      likelihood: 'HIGH',
      evidence: [
        'Base D1 planetary longitudes pass, but divisional chart sign assignments differ.',
        'Difference stems from divisional chart division mapping algorithm.',
      ],
      recommendedInvestigation: 'Verify divisional chart division rules (Parashari vs Jaimini variants).',
    });
  }

  // 5. Longitude / Nakshatra Boundary Sensitivity
  const boundaryFails = failedItems.filter((r) => {
    const actualNum = typeof r.actualValue === 'number' ? r.actualValue : parseFloat(String(r.actualValue));
    if (isNaN(actualNum)) return false;
    const degInSign = actualNum % 30;
    return degInSign < 0.05 || degInSign > 29.95;
  });

  if (boundaryFails.length > 0) {
    candidates.push({
      category: 'LONGITUDE_BOUNDARY',
      type: 'LONGITUDE_BOUNDARY',
      likelihood: 'HIGH',
      evidence: boundaryFails.map(
        (b) => `Planet/Point ${b.planetOrKey} is positioned near sign boundary (${b.actualValue}°).`
      ),
      recommendedInvestigation: 'Check whether reference software rounded longitudes before displaying sign.',
    });
  }

  // 6. Dasha Calculation Variant
  const dashaFails = failedItems.filter((r) => r.planetOrKey === 'Dasha');
  if (dashaFails.length > 0) {
    candidates.push({
      category: 'DASHA_CALCULATION_VARIANT',
      type: 'DASHA_CALCULATION_VARIANT',
      likelihood: 'MEDIUM',
      evidence: dashaFails.map((d) => `Dasha field '${d.field}' mismatch: expected '${d.expectedValue}', actual '${d.actualValue}'.`),
      recommendedInvestigation: 'Verify 365.2425 day solar year vs 360 day Savana year in Dasha engine.',
    });
  }

  // Fallback candidate if unclassified
  if (candidates.length === 0) {
    candidates.push({
      category: 'UNKNOWN',
      type: 'UNKNOWN',
      likelihood: 'LOW',
      evidence: [`Unclassified mismatch across ${failedItems.length} components.`],
      recommendedInvestigation: 'Perform manual step-by-step audit of reference software calculation settings.',
    });
  }

  const primaryCandidate = candidates[0];
  const summary = `Primary diagnostic candidate: ${primaryCandidate.type} (${primaryCandidate.likelihood} likelihood).`;

  return {
    hasMismatch: true,
    totalFailedComponents: failedItems.length,
    candidates,
    summary,
  };
}
