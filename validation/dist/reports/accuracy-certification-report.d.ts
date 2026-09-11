import { BenchmarkCase } from '@vedica/benchmark-store';
import { BirthChartRunResult } from '../benchmark-runners/birth-chart-runner.js';
export interface CertificationSummary {
    generatedAt: string;
    datasetVersion: string;
    totalCases: number;
    externallyReferencedCases: number;
    fullyReferencedCases: number;
    partiallyReferencedCases: number;
    unreferencedCases: number;
    passedCases: number;
    failedCases: number;
    incomparableCases: number;
    totalComparisonsPerformed: number;
    totalPassedComparisons: number;
    totalFailedComparisons: number;
    maxAngularDifference: number;
    meanAngularDifference: number;
    medianAngularDifference: number;
    rmsAngularDifference: number;
    resultsByCase: BirthChartRunResult[];
}
export declare function generateAccuracyCertification(benchmarkCases: BenchmarkCase[], tolerance?: number, targetSoftware?: string): Promise<{
    summary: CertificationSummary;
    textReport: string;
}>;
//# sourceMappingURL=accuracy-certification-report.d.ts.map