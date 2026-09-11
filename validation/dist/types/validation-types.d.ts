import { PlanetName } from '@vedica/astrology-core';
export type BenchmarkSourceType = 'REAL_WORLD_BENCHMARK' | 'SYNTHETIC_TEST_FIXTURE';
export type BenchmarkValidationStatus = 'PASS' | 'FAIL' | 'NOT_VALIDATED';
export interface JHoraBenchmarkCase {
    id: string;
    description: string;
    category: 'NORMAL_INDIAN_BIRTH' | 'MIDNIGHT_BIRTH' | 'LAGNA_BOUNDARY' | 'NAKSHATRA_BOUNDARY' | 'SIGN_BOUNDARY' | 'FOREIGN_DST_BIRTH' | 'HIGH_LATITUDE_BIRTH' | 'HISTORICAL_BIRTH' | 'TIMEZONE_OFFSET' | 'LONGITUDINAL_VARIANCE';
    sourceType: BenchmarkSourceType;
    source: {
        application: string;
        calculationProfile: string;
    };
    input: {
        dateOfBirth: string;
        timeOfBirth: string;
        latitude: number;
        longitude: number;
        timezone: string;
    };
    expected?: {
        ascendant?: {
            sign: string;
            longitude: number;
        };
        planets?: Record<string, {
            sign: string;
            longitude: number;
            nakshatra?: string;
            pada?: number;
        }>;
    };
    status: BenchmarkValidationStatus;
}
export interface JHoraBenchmarkResult {
    caseId: string;
    category: string;
    sourceType: BenchmarkSourceType;
    passed: boolean;
    status: BenchmarkValidationStatus;
    tolerance: number;
    details: Array<{
        field: string;
        expected: any;
        actual: any;
        difference?: number;
        passed: boolean;
    }>;
}
export interface DashaBenchmarkCase {
    id: string;
    benchmarkChartId: string;
    sourceType: BenchmarkSourceType;
    testInstant: string;
    input: {
        moonLongitude: number;
        birthInstant: string;
    };
    expected?: {
        birthDashaLord: PlanetName;
        currentMahadasha: PlanetName;
        currentAntardasha: PlanetName;
        currentPratyantardasha: PlanetName;
    };
    status: BenchmarkValidationStatus;
}
export interface TransitBenchmarkCase {
    id: string;
    sourceType: BenchmarkSourceType;
    testInstant: string;
    calculationProfile: string;
    expected?: Record<string, {
        sign: string;
        longitude: number;
    }>;
    status: BenchmarkValidationStatus;
}
export interface RegressionSnapshot {
    chartId: string;
    profiles: {
        calculation: string;
        analysis: string;
        rules: string;
        timing: string;
        interpretation: string;
    };
    outputHash: string;
    snapshotData: Record<string, any>;
}
export interface AstrologyReferenceBenchmark {
    source: 'JHORA' | 'SWISS_EPHEMERIS' | 'OTHER_VERIFIED_SOURCE';
    sourceVersion?: string;
    input: Record<string, any>;
    expected: Record<string, any>;
    status: BenchmarkValidationStatus;
}
export interface ValidationSummaryReport {
    generatedAt: string;
    locationValidation: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    timezoneValidation: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    dstValidation: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    astrologyBenchmarks: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    jhoraBenchmarks: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    dashaBenchmarks: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    transitBenchmarks: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
    };
    regressionTests: {
        total: number;
        passed: number;
        failed: number;
    };
}
//# sourceMappingURL=validation-types.d.ts.map