export const CANONICAL_EXPECTED_BAV_TOTALS = {
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
export function validateAshtakavarga(bavMap, sav) {
    const bavRowValidation = {};
    let expectedSAVTotal = 0;
    for (const planet of Object.keys(CANONICAL_EXPECTED_BAV_TOTALS)) {
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
        bavRowValidation: bavRowValidation,
    };
}
