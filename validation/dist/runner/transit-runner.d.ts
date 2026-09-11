import { TransitBenchmarkCase } from '../types/validation-types.js';
export declare function runTransitBenchmark(testCase: TransitBenchmarkCase, tolerance?: number): Promise<{
    caseId: string;
    passed: boolean;
    status: string;
    details: string;
} | {
    caseId: string;
    passed: boolean;
    status: string;
    details: {
        planet: string;
        expected: number;
        actual: number;
        diff: number;
        passed: boolean;
    }[];
}>;
export declare function verifyTransitReproducibility(testInstant: string): Promise<boolean>;
//# sourceMappingURL=transit-runner.d.ts.map