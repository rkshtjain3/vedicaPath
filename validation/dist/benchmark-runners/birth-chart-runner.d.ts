import { BenchmarkCase, ComponentComparisonResult, ValidationStatus, ReferenceCompleteness, ReferenceCoverageStatus, ValidationExecutionResult, VerificationStatus, AccuracyMetrics } from '@vedica/benchmark-store';
import { classifyMismatch } from './mismatch-classifier.js';
export interface BirthChartBenchmarkDetail extends ComponentComparisonResult {
    category: 'ASCENDANT' | 'PLANET_LONGITUDE' | 'SIGN' | 'NAKSHATRA' | 'HOUSE' | 'DASHA' | 'DIVISIONAL';
    status: 'PASS' | 'FAIL' | 'NOT_VALIDATED';
    mismatchType?: string;
    boundarySensitive?: boolean;
}
export interface BirthChartRunResult {
    benchmarkId: string;
    caseName: string;
    executedAt: string;
    validationStatus: ValidationStatus;
    overallResult: 'PASS' | 'FAIL' | 'PARTIALLY_VALIDATED' | 'NOT_VALIDATED';
    referenceCoverageStatus: ReferenceCoverageStatus;
    verificationStatus: VerificationStatus;
    validationExecutionResult: ValidationExecutionResult;
    completeness: ReferenceCompleteness;
    accuracyMetrics?: AccuracyMetrics;
    details: BirthChartBenchmarkDetail[];
    summary: {
        totalComponents: number;
        passedComponents: number;
        failedComponents: number;
        unvalidatedComponents: number;
    };
    mismatchDiagnostics?: ReturnType<typeof classifyMismatch>;
    actualChartOutputs: Record<string, any>;
    configurationMismatchNote?: string;
}
export interface MultiCaseBenchmarkSummary {
    executedAt: string;
    totalCases: number;
    casesWithReferenceData: number;
    fullyReferencedCases: number;
    partiallyReferencedCases: number;
    unreferencedCases: number;
    passedCases: number;
    failedCases: number;
    incomparableCases: number;
    overallComponentPassRate: number;
    maximumObservedAngularDifference: number;
    meanObservedAngularDifference: number;
    medianObservedAngularDifference: number;
    rmsObservedAngularDifference: number;
    caseResults: BirthChartRunResult[];
}
export declare function computeCircularAngularDifference(deg1: number, deg2: number): number;
export declare function calculateMedian(numbers: number[]): number;
export declare function calculateRMS(numbers: number[]): number;
export declare function runBirthChartBenchmark(testCase: BenchmarkCase, tolerance?: number, targetSoftware?: string): Promise<BirthChartRunResult>;
export declare function runMultiCaseChartBenchmark(cases: BenchmarkCase[], tolerance?: number, targetSoftware?: string): Promise<MultiCaseBenchmarkSummary>;
//# sourceMappingURL=birth-chart-runner.d.ts.map