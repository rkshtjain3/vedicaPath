export const PERSONAL_BENCHMARK_TOLERANCE_V1 = {
    name: 'Personal Vedic Benchmark Tolerance Standard',
    version: '1.0.0',
    planetaryLongitudeDegreeTolerance: 0.05,
    virupaTolerance: 0.05,
    exactMatchFields: [
        'sign',
        'house',
        'nakshatra',
        'pada',
        'mahadashaLord',
        'antardashaLord',
        'pratyantardashaLord',
        'ashtakavargaBindu',
        'savTotal',
    ],
};
/**
 * Calculates the shortest circular angular difference between two angles in degrees [0, 360).
 * Examples:
 * - 359.99° and 0.01° => 0.02°
 * - 10° and 15° => 5°
 */
export function calculateCircularAngularDiff(deg1, deg2) {
    const norm1 = ((deg1 % 360) + 360) % 360;
    const norm2 = ((deg2 % 360) + 360) % 360;
    const diff = Math.abs(norm1 - norm2);
    return Math.min(diff, 360 - diff);
}
export function evaluateNumericComponent(actual, expected, tolerance = PERSONAL_BENCHMARK_TOLERANCE_V1.planetaryLongitudeDegreeTolerance, isCircular = false) {
    if (expected === undefined || expected === null) {
        return {
            status: 'NOT_VALIDATED',
            passed: false,
            notes: 'No reference benchmark value provided.',
        };
    }
    if (actual === undefined || actual === null) {
        return {
            status: 'NOT_COMPARABLE',
            passed: false,
            notes: 'Calculated value is undefined or unavailable.',
        };
    }
    const diff = isCircular
        ? calculateCircularAngularDiff(actual, expected)
        : Math.abs(actual - expected);
    const passed = diff <= tolerance;
    return {
        status: passed ? 'PASS' : 'FAIL',
        difference: parseFloat(diff.toFixed(4)),
        tolerance,
        passed,
        notes: passed
            ? `Within tolerance (${diff.toFixed(4)} <= ${tolerance})`
            : `Exceeds tolerance (${diff.toFixed(4)} > ${tolerance})`,
    };
}
export function evaluateExactComponent(actual, expected) {
    if (expected === undefined || expected === null || expected === '') {
        return {
            status: 'NOT_VALIDATED',
            passed: false,
            notes: 'No reference benchmark value provided.',
        };
    }
    if (actual === undefined || actual === null) {
        return {
            status: 'NOT_COMPARABLE',
            passed: false,
            notes: 'Calculated value is undefined or unavailable.',
        };
    }
    const actStr = String(actual).trim().toLowerCase();
    const expStr = String(expected).trim().toLowerCase();
    const passed = actStr === expStr;
    return {
        status: passed ? 'PASS' : 'FAIL',
        passed,
        notes: passed
            ? 'Exact match confirmed.'
            : `Value mismatch: expected '${expected}', got '${actual}'.`,
    };
}
//# sourceMappingURL=tolerance-policy.js.map