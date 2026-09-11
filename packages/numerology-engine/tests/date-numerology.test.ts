import { describe, expect, it } from 'vitest';
import {
  calculateAttitudeNumber,
  calculateBirthdayNumber,
  calculateLifePathNumber,
  calculatePersonalDayNumber,
  calculatePersonalMonthNumber,
  calculatePersonalYearNumber,
  reduceNumber,
} from '../src/index.js';

describe('Numerology Engine - Date Based Calculations', () => {
  it('should calculate Life Path Number correctly for prompt example 1996-09-23', () => {
    const result = calculateLifePathNumber('1996-09-23');

    expect(result.finalNumber).toBe(3);
    expect(result.isMasterNumber).toBe(false);
    expect(result.formulaSteps.length).toBe(3);
    expect(result.formulaSteps[0].result).toBe(39);
    expect(result.formulaSteps[1].result).toBe(12);
    expect(result.formulaSteps[2].result).toBe(3);
  });

  it('should calculate Birthday Number correctly', () => {
    const result = calculateBirthdayNumber('1996-09-23');
    expect(result.finalNumber).toBe(5);
  });

  it('should calculate Attitude Number correctly', () => {
    const result = calculateAttitudeNumber('1996-09-23');
    expect(result.finalNumber).toBe(5);
  });

  it('should preserve Master Numbers when option is enabled', () => {
    const reduction = reduceNumber(29, { preserveMasterNumbers: true });
    expect(reduction.finalNumber).toBe(11);
    expect(reduction.isMaster).toBe(true);

    const reductionDisabled = reduceNumber(29, { preserveMasterNumbers: false });
    expect(reductionDisabled.finalNumber).toBe(2);
    expect(reductionDisabled.isMaster).toBe(false);
  });

  it('should calculate Personal Year, Month, and Day numbers', () => {
    const py = calculatePersonalYearNumber('1996-09-23', 2026);
    expect(typeof py.finalNumber).toBe('number');
    expect(py.formulaSteps.length).toBeGreaterThan(0);

    const pm = calculatePersonalMonthNumber('1996-09-23', 2026, 8);
    expect(typeof pm.finalNumber).toBe('number');

    const pd = calculatePersonalDayNumber('1996-09-23', 2026, 8, 29);
    expect(typeof pd.finalNumber).toBe('number');
  });
});
