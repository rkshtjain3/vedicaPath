import { BenchmarkStore } from '../store/benchmark-store.interface.js';
import { BenchmarkCase, BenchmarkExecutionResult, CalculationInputSnapshot, ComponentComparisonResult, DriftResult } from '../types/benchmark-types.js';
export declare function computeInputFingerprint(snapshot: CalculationInputSnapshot): string;
export declare function detectInputDrift(benchmarkCase: BenchmarkCase, currentProfileVersion?: string): DriftResult;
export interface RunBenchmarkParams<T = any> {
    benchmarkId: string;
    store: BenchmarkStore;
    currentProfileVersion?: string;
    calculate: (snapshot: CalculationInputSnapshot) => Promise<T> | T;
    compare: (actual: T, referenceValues: Record<string, any>) => ComponentComparisonResult[];
}
export declare class BenchmarkService {
    static runBenchmark<T = any>(params: RunBenchmarkParams<T>): Promise<BenchmarkExecutionResult>;
}
//# sourceMappingURL=benchmark-service.d.ts.map