import { ShadbalaJHoraBenchmark, BenchmarkCaseResult, ShadbalaTolerancePolicy } from './shadbala-jhora-benchmark-schema.js';
export declare class ShadbalaBenchmarkRunner {
    private engine;
    private tolerancePolicy;
    constructor(tolerancePolicy?: ShadbalaTolerancePolicy);
    runBenchmarkCase(benchmarkCase: ShadbalaJHoraBenchmark): Promise<BenchmarkCaseResult>;
}
//# sourceMappingURL=runner.d.ts.map