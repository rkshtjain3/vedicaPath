import { BenchmarkStore } from '../store/benchmark-store.interface.js';
import { BenchmarkCase, BenchmarkCategory, BenchmarkExportResult, BenchmarkImportResult, BenchmarkReferenceUpdate, BenchmarkResult } from '../types/benchmark-types.js';
export declare const CURRENT_SCHEMA_VERSION = "1.0.0";
export declare const CURRENT_DATASET_VERSION = "1.0.0";
export declare class FileBenchmarkStore implements BenchmarkStore {
    private baseDir;
    constructor(baseDir?: string);
    private getCategoryDir;
    private getDatasetPath;
    private atomicWriteJson;
    private loadDataset;
    private saveDataset;
    listCases(category?: BenchmarkCategory): Promise<BenchmarkCase[]>;
    getCase(id: string): Promise<BenchmarkCase | null>;
    createCase(caseData: Omit<BenchmarkCase, 'createdAt' | 'updatedAt'>): Promise<BenchmarkCase>;
    updateCase(id: string, updates: Partial<BenchmarkCase>): Promise<BenchmarkCase>;
    updateReference(update: BenchmarkReferenceUpdate): Promise<BenchmarkCase>;
    saveResult(result: BenchmarkResult): Promise<BenchmarkResult>;
    getResult(caseId: string): Promise<BenchmarkResult | null>;
    deleteCase(id: string): Promise<boolean>;
    exportDataset(category?: BenchmarkCategory): Promise<BenchmarkExportResult>;
    importDataset(datasetInput: unknown, overwriteExisting?: boolean): Promise<BenchmarkImportResult>;
}
//# sourceMappingURL=file-benchmark-store.d.ts.map