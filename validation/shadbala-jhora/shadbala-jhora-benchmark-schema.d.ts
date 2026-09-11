import { ShadbalaBenchmarkStatus, MismatchCause } from '@vedica/shadbala-engine';
export interface ComponentReferenceValues {
    uchchaBala?: number;
    ojayugmaBala?: number;
    kendradiBala?: number;
    drekkanaBala?: number;
    saptavargajaBala?: number;
    digBala?: number;
    naisargikaBala?: number;
    cheshtaBala?: number;
    totalVirupas?: number;
}
export type ShadbalaReferenceValuesMap = Record<string, ComponentReferenceValues>;
export interface ShadbalaJHoraBenchmark {
    id: string;
    description: string;
    source: {
        software: 'JHora';
        version?: string;
        settings: {
            ayanamsha: string;
            zodiac: 'SIDEREAL';
            houseSystem?: string;
        };
    };
    birthDetails: {
        date: string;
        time: string;
        location: string;
        latitude: number;
        longitude: number;
        timezone: string;
    };
    expected: ShadbalaReferenceValuesMap;
    validationStatus: ShadbalaBenchmarkStatus;
}
export interface ComponentComparisonResult {
    planet: string;
    component: string;
    expected: number | null;
    actual: number | null;
    difference: number | null;
    tolerance: number;
    result: 'PASS' | 'FAIL' | 'NOT_VALIDATED';
    mismatchCause?: MismatchCause;
    notes?: string;
}
export interface BenchmarkCaseResult {
    benchmarkId: string;
    description: string;
    validationStatus: ShadbalaBenchmarkStatus;
    components: ComponentComparisonResult[];
    overallResult: 'PASS' | 'FAIL' | 'NOT_VALIDATED';
}
export interface ShadbalaTolerancePolicy {
    defaultVirupaTolerance: number;
    componentOverrides: Record<string, number>;
}
export declare const DEFAULT_SHADBALA_TOLERANCE_POLICY: ShadbalaTolerancePolicy;
//# sourceMappingURL=shadbala-jhora-benchmark-schema.d.ts.map