import {
  BenchmarkCase,
  BenchmarkCategory,
  BenchmarkDataset,
  BenchmarkExportResult,
  BenchmarkImportResult,
  BenchmarkReferenceUpdate,
  BenchmarkResult,
} from '../types/benchmark-types.js';

export interface BenchmarkStore {
  listCases(category?: BenchmarkCategory): Promise<BenchmarkCase[]>;
  getCase(id: string): Promise<BenchmarkCase | null>;
  createCase(caseData: Omit<BenchmarkCase, 'createdAt' | 'updatedAt'>): Promise<BenchmarkCase>;
  updateCase(id: string, updates: Partial<BenchmarkCase>): Promise<BenchmarkCase>;
  updateReference(update: BenchmarkReferenceUpdate): Promise<BenchmarkCase>;
  saveResult(result: BenchmarkResult): Promise<BenchmarkResult>;
  getResult(caseId: string): Promise<BenchmarkResult | null>;
  deleteCase(id: string): Promise<boolean>;
  exportDataset(category?: BenchmarkCategory): Promise<BenchmarkExportResult>;
  importDataset(dataset: unknown, overwriteExisting?: boolean): Promise<BenchmarkImportResult>;
}
