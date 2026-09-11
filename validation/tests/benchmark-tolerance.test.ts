import { describe, it, expect } from 'vitest';
import {
  calculateCircularAngularDiff,
  evaluateNumericComponent,
  evaluateExactComponent,
} from '@vedica/benchmark-store';

describe('Phase 15 — Benchmark Tolerance & Circular Angular Distance Tests', () => {
  it('correctly calculates 360° circular modular distance across 0° boundary', () => {
    // 359.99° and 0.01° should have a difference of 0.02°
    const diff1 = calculateCircularAngularDiff(359.99, 0.01);
    expect(diff1).toBeCloseTo(0.02, 4);

    // 0.05° and 359.95° => 0.10°
    const diff2 = calculateCircularAngularDiff(0.05, 359.95);
    expect(diff2).toBeCloseTo(0.1, 4);

    // Standard non-boundary diff: 120.5° vs 120.53° => 0.03°
    const diff3 = calculateCircularAngularDiff(120.5, 120.53);
    expect(diff3).toBeCloseTo(0.03, 4);
  });

  it('evaluates circular numeric components against PERSONAL_BENCHMARK_TOLERANCE_V1 (0.05°)', () => {
    // Within tolerance across boundary
    const res1 = evaluateNumericComponent(359.98, 0.01, 0.05, true);
    expect(res1.status).toBe('PASS');
    expect(res1.passed).toBe(true);
    expect(res1.difference).toBeCloseTo(0.03, 4);

    // Exceeds tolerance
    const res2 = evaluateNumericComponent(359.90, 0.01, 0.05, true);
    expect(res2.status).toBe('FAIL');
    expect(res2.passed).toBe(false);
    expect(res2.difference).toBeCloseTo(0.11, 4);
  });

  it('strictly returns NOT_VALIDATED when expected reference value is missing', () => {
    const res = evaluateNumericComponent(245.12, undefined, 0.05, true);
    expect(res.status).toBe('NOT_VALIDATED');
    expect(res.passed).toBe(false);
    expect(res.notes).toContain('No reference benchmark value');
  });

  it('correctly evaluates exact string and integer component matches', () => {
    // Matching case-insensitive
    const res1 = evaluateExactComponent('Aries', 'aries');
    expect(res1.status).toBe('PASS');

    // Mismatched
    const res2 = evaluateExactComponent('Taurus', 'Aries');
    expect(res2.status).toBe('FAIL');

    // Missing reference
    const res3 = evaluateExactComponent('Leo', null);
    expect(res3.status).toBe('NOT_VALIDATED');
  });
});
