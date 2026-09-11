import { BenchmarkStore } from '../store/benchmark-store.interface.js';
import { BenchmarkCase, BenchmarkCategory, BenchmarkExportResult, BenchmarkImportResult, BenchmarkReferenceUpdate, BenchmarkResult } from '../types/benchmark-types.js';
export interface SqliteDatabaseInterface {
    exec(sql: string): void;
    prepare(sql: string): {
        run(...args: any[]): {
            changes: number;
        };
        get(...args: any[]): any;
        all(...args: any[]): any[];
    };
}
export declare class SqliteBenchmarkStore implements BenchmarkStore {
    private db;
    constructor(dbPathOrInstance?: string | SqliteDatabaseInterface);
    private initTables;
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
//# sourceMappingURL=sqlite-benchmark-store.d.ts.map