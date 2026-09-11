import { ShadbalaJHoraBenchmark, MismatchCause } from './shadbala-jhora-benchmark-schema.js';
export interface StoredBenchmarkData {
    caseId: string;
    checklistConfirmed: boolean;
    referenceValues: Record<string, Record<string, number>>;
    investigationCause?: MismatchCause;
    investigationNotes?: string;
    updatedAt: string;
    fingerprint: string;
    referenceHash: string;
}
export interface FullBenchmarkExport {
    exportVersion: string;
    timestamp: string;
    benchmarks: Record<string, StoredBenchmarkData>;
}
export declare function computeInputFingerprint(benchmarkCase: ShadbalaJHoraBenchmark): string;
export declare function computeReferenceHash(referenceValues: Record<string, Record<string, number>>): string;
export declare class ShadbalaBenchmarkStore {
    private data;
    constructor();
    private ensureDir;
    private load;
    private save;
    getStoredCaseData(caseId: string): StoredBenchmarkData | undefined;
    getAllStoredData(): Record<string, StoredBenchmarkData>;
    saveReferenceData(caseId: string, checklistConfirmed: boolean, referenceValues: Record<string, Record<string, number>>, investigationCause?: MismatchCause, investigationNotes?: string): StoredBenchmarkData;
    evaluateCaseWithStore(caseId: string): Promise<{
        benchmarkCase: ShadbalaJHoraBenchmark;
        storedData: StoredBenchmarkData;
        comparisonResult: import("./shadbala-jhora-benchmark-schema.js").BenchmarkCaseResult;
        fingerprint: string;
        referenceHash: string;
    }>;
    exportData(): FullBenchmarkExport;
    importData(exportObj: FullBenchmarkExport): {
        importedCount: number;
    };
}
//# sourceMappingURL=store.d.ts.map