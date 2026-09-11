import { ShadbalaJHoraBenchmark } from '../shadbala-jhora-benchmark-schema.js';
import { BenchmarkStore } from './benchmark-store.js';
import { StoredBenchmarkData, FullBenchmarkExport, BenchmarkCaseSummary, SaveBenchmarkReferenceInput } from './types.js';
export declare function computeInputFingerprint(benchmarkCase: ShadbalaJHoraBenchmark): string;
export declare function computeReferenceHash(referenceValues: Record<string, Record<string, number>>): string;
export declare class FileBenchmarkStore implements BenchmarkStore {
    private data;
    private engine;
    private runner;
    constructor();
    private ensureDir;
    private load;
    private save;
    getCases(): Promise<BenchmarkCaseSummary[]>;
    getCase(caseId: string): Promise<any | null>;
    saveReference(input: SaveBenchmarkReferenceInput): Promise<StoredBenchmarkData>;
    getResults(caseId: string): Promise<any | null>;
    exportBenchmark(): Promise<FullBenchmarkExport>;
    importBenchmark(exportObj: FullBenchmarkExport): Promise<{
        importedCount: number;
    }>;
}
//# sourceMappingURL=file-benchmark-store.d.ts.map