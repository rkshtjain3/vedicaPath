import { MismatchCause } from '@vedica/shadbala-engine';
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
export interface BenchmarkCaseSummary {
    id: string;
    description: string;
    location: string;
    date: string;
    time: string;
    status: string;
    fingerprint: string;
    hasStoredData: boolean;
}
export interface SaveBenchmarkReferenceInput {
    caseId: string;
    checklistConfirmed: boolean;
    referenceValues: Record<string, Record<string, number>>;
    investigationCause?: MismatchCause;
    investigationNotes?: string;
}
//# sourceMappingURL=types.d.ts.map