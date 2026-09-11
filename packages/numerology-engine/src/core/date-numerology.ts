import {
  NumerologyCalculationResult,
  NumerologyOptions,
  ReductionStep,
} from '../types/numerology.js';
import { reduceNumber, sumDigits } from './reduction.js';

export interface DateInput {
  dateOfBirth: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD
}

/**
 * Calculates Life Path Number.
 * Example (from prompt): 23/09/1996
 * Step 1: 2 + 3 + 0 + 9 + 1 + 9 + 9 + 6 = 39
 * Step 2: 3 + 9 = 12
 * Step 3: 1 + 2 = 3
 */
export function calculateLifePathNumber(
  dob: string,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NumerologyCalculationResult {
  const cleanDob = dob.replace(/[^0-9]/g, '');
  const digits = cleanDob.split('').map((d) => parseInt(d, 10));
  const initialSum = digits.reduce((acc, d) => acc + d, 0);

  const initialExpression = `${digits.join(' + ')} = ${initialSum}`;
  const formulaSteps: ReductionStep[] = [
    {
      stepNumber: 1,
      description: 'Sum of all birth date digits',
      expression: initialExpression,
      result: initialSum,
    },
  ];

  const reduction = reduceNumber(initialSum, options);
  reduction.steps.forEach((step) => {
    formulaSteps.push({
      ...step,
      stepNumber: formulaSteps.length + 1,
    });
  });

  return {
    title: 'Life Path Number',
    inputValues: { dateOfBirth: dob },
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Birthday Number.
 * Based on day of birth (1-31).
 */
export function calculateBirthdayNumber(
  dob: string,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NumerologyCalculationResult {
  const parts = dob.split('-');
  const dayStr = parts[2] || parts[0];
  const dayNum = parseInt(dayStr, 10);

  const formulaSteps: ReductionStep[] = [];
  const reduction = reduceNumber(dayNum, options);

  if (reduction.steps.length === 0) {
    formulaSteps.push({
      stepNumber: 1,
      description: `Day of birth ${dayNum}`,
      expression: `${dayNum}`,
      result: dayNum,
    });
  } else {
    reduction.steps.forEach((s, idx) => {
      formulaSteps.push({
        ...s,
        stepNumber: idx + 1,
      });
    });
  }

  return {
    title: 'Birthday Number',
    inputValues: { dateOfBirth: dob, day: dayNum },
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Attitude Number (Sun Number / Achievement Number).
 * Sum of Day + Month of birth.
 */
export function calculateAttitudeNumber(
  dob: string,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NumerologyCalculationResult {
  const parts = dob.split('-');
  const monthNum = parseInt(parts[1], 10);
  const dayNum = parseInt(parts[2], 10);

  const sum = dayNum + monthNum;
  const formulaSteps: ReductionStep[] = [
    {
      stepNumber: 1,
      description: `Sum of Day (${dayNum}) + Month (${monthNum})`,
      expression: `${dayNum} + ${monthNum} = ${sum}`,
      result: sum,
    },
  ];

  const reduction = reduceNumber(sum, options);
  reduction.steps.forEach((s) => {
    formulaSteps.push({
      ...s,
      stepNumber: formulaSteps.length + 1,
    });
  });

  return {
    title: 'Attitude Number',
    inputValues: { dateOfBirth: dob, day: dayNum, month: monthNum },
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Personal Year Number.
 * Formula: Day of Birth + Month of Birth + Target Year, reduced.
 */
export function calculatePersonalYearNumber(
  dob: string,
  targetYear: number,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NumerologyCalculationResult {
  const parts = dob.split('-');
  const monthNum = parseInt(parts[1], 10);
  const dayNum = parseInt(parts[2], 10);

  const dayMonthMonthYearStr = `${String(dayNum).padStart(2, '0')}${String(monthNum).padStart(2, '0')}${targetYear}`;
  const digits = dayMonthMonthYearStr.split('').map((d) => parseInt(d, 10));
  const initialSum = digits.reduce((acc, d) => acc + d, 0);

  const formulaSteps: ReductionStep[] = [
    {
      stepNumber: 1,
      description: `Sum of Day (${dayNum}), Month (${monthNum}) & Target Year (${targetYear}) digits`,
      expression: `${digits.join(' + ')} = ${initialSum}`,
      result: initialSum,
    },
  ];

  const reduction = reduceNumber(initialSum, options);
  reduction.steps.forEach((s) => {
    formulaSteps.push({
      ...s,
      stepNumber: formulaSteps.length + 1,
    });
  });

  return {
    title: 'Personal Year Number',
    inputValues: { dateOfBirth: dob, targetYear },
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Personal Month Number.
 * Formula: Personal Year Number + Target Month (1-12), reduced.
 */
export function calculatePersonalMonthNumber(
  dob: string,
  targetYear: number,
  targetMonth: number,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NumerologyCalculationResult {
  const pyResult = calculatePersonalYearNumber(dob, targetYear, options);
  const pyNum = pyResult.finalNumber;

  const sum = pyNum + targetMonth;
  const formulaSteps: ReductionStep[] = [
    {
      stepNumber: 1,
      description: `Personal Year Number (${pyNum}) + Target Month (${targetMonth})`,
      expression: `${pyNum} + ${targetMonth} = ${sum}`,
      result: sum,
    },
  ];

  const reduction = reduceNumber(sum, options);
  reduction.steps.forEach((s) => {
    formulaSteps.push({
      ...s,
      stepNumber: formulaSteps.length + 1,
    });
  });

  return {
    title: 'Personal Month Number',
    inputValues: { dateOfBirth: dob, targetYear, targetMonth, personalYear: pyNum },
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}

/**
 * Calculates Personal Day Number.
 * Formula: Personal Month Number + Target Day (1-31), reduced.
 */
export function calculatePersonalDayNumber(
  dob: string,
  targetYear: number,
  targetMonth: number,
  targetDay: number,
  options: NumerologyOptions = { preserveMasterNumbers: true }
): NumerologyCalculationResult {
  const pmResult = calculatePersonalMonthNumber(dob, targetYear, targetMonth, options);
  const pmNum = pmResult.finalNumber;

  const sum = pmNum + targetDay;
  const formulaSteps: ReductionStep[] = [
    {
      stepNumber: 1,
      description: `Personal Month Number (${pmNum}) + Target Day (${targetDay})`,
      expression: `${pmNum} + ${targetDay} = ${sum}`,
      result: sum,
    },
  ];

  const reduction = reduceNumber(sum, options);
  reduction.steps.forEach((s) => {
    formulaSteps.push({
      ...s,
      stepNumber: formulaSteps.length + 1,
    });
  });

  return {
    title: 'Personal Day Number',
    inputValues: { dateOfBirth: dob, targetYear, targetMonth, targetDay, personalMonth: pmNum },
    formulaSteps,
    finalNumber: reduction.finalNumber,
    isMasterNumber: reduction.isMaster,
  };
}
