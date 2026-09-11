import { NumerologyOptions, ReductionStep } from '../types/numerology.js';
export declare function isMasterNumber(num: number): boolean;
export declare function sumDigits(num: number): {
    sum: number;
    digits: number[];
    expression: string;
};
/**
 * Reduces a number to a single digit (or master number 11, 22, 33).
 * Produces step-by-step reduction records.
 */
export declare function reduceNumber(num: number, options?: NumerologyOptions): {
    finalNumber: number;
    steps: ReductionStep[];
    isMaster: boolean;
};
//# sourceMappingURL=reduction.d.ts.map