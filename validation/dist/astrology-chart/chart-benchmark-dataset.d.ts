import { BenchmarkCase } from '@vedica/benchmark-store';
export interface ChartBenchmarkDatasetFile {
    schemaVersion: string;
    datasetVersion: string;
    category: string;
    exportedAt: string;
    metadata: Record<string, any>;
    cases: BenchmarkCase[];
}
export declare function resolveChartDatasetPath(): string;
export declare function loadChartBenchmarkCases(): BenchmarkCase[];
export declare function getChartBenchmarkCaseById(caseId: string): BenchmarkCase | undefined;
export declare function saveChartBenchmarkReference(caseId: string, referenceValues: Record<string, any>, referenceSourceNotes?: string, provenance?: Record<string, any>): BenchmarkCase;
//# sourceMappingURL=chart-benchmark-dataset.d.ts.map