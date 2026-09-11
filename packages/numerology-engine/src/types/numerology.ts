export interface ReductionStep {
  stepNumber: number;
  description: string;
  expression: string; // e.g., "2 + 3 + 0 + 9 + 1 + 9 + 9 + 6 = 39"
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
  preserveMasterNumbers?: boolean; // Default: true (11, 22, 33)
}
