import {
  AshtakavargaPlanet,
  BhinnaAshtakavarga,
  Sarvashtakavarga,
  AshtakavargaValidation,
} from '../types/ashtakavarga-types.js';

export const CANONICAL_EXPECTED_BAV_TOTALS: Record<AshtakavargaPlanet, number> = {
  SUN: 48,
  MOON: 49,
  MARS: 39,
  MERCURY: 54,
  JUPITER: 56,
  VENUS: 52,
  SATURN: 39,
};

/**
 * Validates BAV row sums and SAV total.
 */
export function validateAshtakavarga(
  bavMap: Record<AshtakavargaPlanet, BhinnaAshtakavarga>,
  sav: Sarvashtakavarga
): AshtakavargaValidation {
  const bavRowValidation: Partial<
    Record<AshtakavargaPlanet, { passed: boolean; expected: number; actual: number }>
  > = {};

  let expectedSAVTotal = 0;

  for (const planet of Object.keys(CANONICAL_EXPECTED_BAV_TOTALS) as AshtakavargaPlanet[]) {
    const expected = CANONICAL_EXPECTED_BAV_TOTALS[planet];
    const actual = bavMap[planet] ? bavMap[planet].totalPoints : 0;
    const passed = expected === actual;

    bavRowValidation[planet] = {
      passed,
      expected,
      actual,
    };

    expectedSAVTotal += actual;
  }

  const actualSAVTotal = sav.totalPoints;
  const allRowsPassed = Object.values(bavRowValidation).every((r) => r.passed);
  const savPassed = expectedSAVTotal === actualSAVTotal;

  return {
    passed: allRowsPassed && savPassed,
    expected: expectedSAVTotal,
    actual: actualSAVTotal,
    bavRowValidation: bavRowValidation as Record<
      AshtakavargaPlanet,
      { passed: boolean; expected: number; actual: number }
    >,
  };
}
