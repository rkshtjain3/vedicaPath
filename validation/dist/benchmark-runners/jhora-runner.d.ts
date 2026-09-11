export interface JHoraBenchmarkDetail {
    engine: string;
    component: string;
    expected: any;
    actual: any;
    difference?: number;
    tolerance?: number;
    status: 'PASS' | 'FAIL' | 'NOT_VALIDATED' | 'NOT_COMPARABLE';
    notes?: string;
}
export interface JHoraRunResult {
    caseId: string;
    executedAt: string;
    status: 'PASS' | 'FAIL' | 'NOT_VALIDATED' | 'NOT_COMPARABLE';
    details: JHoraBenchmarkDetail[];
    summary: {
        total: number;
        passed: number;
        failed: number;
        notValidated: number;
        notComparable: number;
    };
    actualOutputs: Record<string, any>;
}
export declare function runJHoraBenchmarkCase(testCase: any): Promise<JHoraRunResult>;
//# sourceMappingURL=jhora-runner.d.ts.map