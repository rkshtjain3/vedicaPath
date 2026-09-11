export type ValidationStatus = 'PASS' | 'FAIL' | 'NOT_VALIDATED';
export interface BenchmarkExpectedPlanet {
    sign: string;
    longitude: number;
    nakshatra?: string;
    pada?: number;
}
export interface BenchmarkExpectedAscendant {
    sign: string;
    longitude: number;
}
export interface BenchmarkExpectedResult {
    ascendant?: BenchmarkExpectedAscendant;
    planets?: Record<string, BenchmarkExpectedPlanet>;
}
export interface AstrologyBenchmark {
    id: string;
    description: string;
    category?: string;
    input: {
        dateOfBirth: string;
        timeOfBirth: string;
        latitude: number;
        longitude: number;
        timezone: string;
        locationName?: string;
    };
    calculationProfile: string;
    expected?: BenchmarkExpectedResult;
    status: ValidationStatus;
}
export interface ValidationItemResult {
    field: string;
    expected: string | number;
    calculated: string | number;
    difference?: number;
    tolerance?: number;
    passed: boolean;
    formattedOutput: string;
}
export interface ValidationReport {
    benchmarkId: string;
    description: string;
    overallStatus: ValidationStatus;
    toleranceDegree: number;
    items: ValidationItemResult[];
    summary: string;
}
//# sourceMappingURL=validation.d.ts.map