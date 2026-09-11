import {
  StoredBenchmarkData,
  FullBenchmarkExport,
  BenchmarkCaseSummary,
  SaveBenchmarkReferenceInput,
} from './types.js';

export interface BenchmarkStore {
  getCases(): Promise<BenchmarkCaseSummary[]>;
  getCase(caseId: string): Promise<any | null>;
  saveReference(input: SaveBenchmarkReferenceInput): Promise<StoredBenchmarkData>;
  getResults(caseId: string): Promise<any | null>;
  exportBenchmark(): Promise<FullBenchmarkExport>;
  importBenchmark(data: FullBenchmarkExport): Promise<{ importedCount: number }>;
}
