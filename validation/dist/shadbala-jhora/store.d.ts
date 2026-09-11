import { BenchmarkStore, BenchmarkCase } from '@vedica/benchmark-store';
import { ShadbalaJHoraBenchmark } from './shadbala-jhora-benchmark-schema.js';
import { MismatchCause } from '@vedica/shadbala-engine';
export interface StoredBenchmarkData {
    caseId: string;
    checklistConfirmed: boolean;
    referenceValues: Record<string, any>;
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
export declare function computeReferenceHash(referenceValues: Record<string, any>): string;
export declare function getBenchmarkStore(): BenchmarkStore;
export declare class ShadbalaBenchmarkStore {
    private fileStore;
    constructor(baseDir?: string);
    getCases(): Promise<BenchmarkCase[]>;
    getStoredCaseData(caseId: string): StoredBenchmarkData | undefined;
    private getCaseSync;
    getAllStoredData(): Record<string, StoredBenchmarkData>;
    saveReference(params: {
        caseId: string;
        checklistConfirmed?: boolean;
        referenceValues: Record<string, any>;
        investigationCause?: MismatchCause;
        investigationNotes?: string;
    }): Promise<StoredBenchmarkData>;
    saveReferenceData(caseId: string, checklistConfirmed: boolean, referenceValues: Record<string, any>, investigationCause?: MismatchCause, investigationNotes?: string): StoredBenchmarkData;
    evaluateCaseWithStore(caseId: string): Promise<{
        benchmarkCase: ShadbalaJHoraBenchmark;
        storedData: StoredBenchmarkData | undefined;
        comparisonResult: import("./shadbala-jhora-benchmark-schema.js").BenchmarkCaseResult;
        fingerprint: string;
        referenceHash: string;
    }>;
    exportBenchmark(): FullBenchmarkExport;
    exportData(): FullBenchmarkExport;
    importData(exportObj: FullBenchmarkExport): {
        importedCount: number;
    };
}
//# sourceMappingURL=store.d.ts.map