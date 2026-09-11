export interface BenchmarkToleranceProfile {
    name: string;
    version: string;
    planetaryLongitudeDegreeTolerance: number;
    virupaTolerance: number;
    exactMatchFields: string[];
    longitudeToleranceDegrees?: number;
    ascendantToleranceDegrees?: number;
    boundaryToleranceDegrees?: number;
}
export declare const PERSONAL_BENCHMARK_TOLERANCE_V1: BenchmarkToleranceProfile;
/**
 * Calculates the shortest circular angular difference between two angles in degrees [0, 360).
 * Examples:
 * - 359.99° and 0.01° => 0.02°
 * - 10° and 15° => 5°
 */
export declare function calculateCircularAngularDiff(deg1: number, deg2: number): number;
export interface ComparisonEvaluation {
    status: 'PASS' | 'FAIL' | 'NOT_VALIDATED' | 'NOT_COMPARABLE';
    difference?: number;
    tolerance?: number;
    passed: boolean;
    notes?: string;
}
export declare function evaluateNumericComponent(actual: number | undefined | null, expected: number | undefined | null, tolerance?: number, isCircular?: boolean): ComparisonEvaluation;
export declare function evaluateExactComponent(actual: string | number | undefined | null, expected: string | number | undefined | null): ComparisonEvaluation;
//# sourceMappingURL=tolerance-policy.d.ts.map