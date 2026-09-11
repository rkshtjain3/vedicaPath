export interface ReductionStep {
    stepNumber: number;
    description: string;
    expression: string;
    result: number;
}
export interface NumerologyCalculationResult {
    title: string;
    inputValues: Record<string, string | number>;
    formulaSteps: ReductionStep[];
    finalNumber: number;
    isMasterNumber: boolean;
}
export interface NumerologyOptions {
    preserveMasterNumbers?: boolean;
}
//# sourceMappingURL=numerology.d.ts.map