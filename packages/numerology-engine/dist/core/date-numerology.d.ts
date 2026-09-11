import { NumerologyCalculationResult, NumerologyOptions } from '../types/numerology.js';
export interface DateInput {
    dateOfBirth: string;
    targetDate?: string;
}
/**
 * Calculates Life Path Number.
 * Example (from prompt): 23/09/1996
 * Step 1: 2 + 3 + 0 + 9 + 1 + 9 + 9 + 6 = 39
 * Step 2: 3 + 9 = 12
 * Step 3: 1 + 2 = 3
 */
export declare function calculateLifePathNumber(dob: string, options?: NumerologyOptions): NumerologyCalculationResult;
/**
 * Calculates Birthday Number.
 * Based on day of birth (1-31).
 */
export declare function calculateBirthdayNumber(dob: string, options?: NumerologyOptions): NumerologyCalculationResult;
/**
 * Calculates Attitude Number (Sun Number / Achievement Number).
 * Sum of Day + Month of birth.
 */
export declare function calculateAttitudeNumber(dob: string, options?: NumerologyOptions): NumerologyCalculationResult;
/**
 * Calculates Personal Year Number.
 * Formula: Day of Birth + Month of Birth + Target Year, reduced.
 */
export declare function calculatePersonalYearNumber(dob: string, targetYear: number, options?: NumerologyOptions): NumerologyCalculationResult;
/**
 * Calculates Personal Month Number.
 * Formula: Personal Year Number + Target Month (1-12), reduced.
 */
export declare function calculatePersonalMonthNumber(dob: string, targetYear: number, targetMonth: number, options?: NumerologyOptions): NumerologyCalculationResult;
/**
 * Calculates Personal Day Number.
 * Formula: Personal Month Number + Target Day (1-31), reduced.
 */
export declare function calculatePersonalDayNumber(dob: string, targetYear: number, targetMonth: number, targetDay: number, options?: NumerologyOptions): NumerologyCalculationResult;
//# sourceMappingURL=date-numerology.d.ts.map