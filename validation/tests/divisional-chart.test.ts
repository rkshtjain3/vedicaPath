import { describe, expect, it } from 'vitest';
import { calculateNavamsaPosition, calculateDashamsaPosition } from '@vedica/divisional-chart-engine';
import d9BoundaryCases from '../divisional-chart-test-cases/d9-boundary-cases.json';
import d10BoundaryCases from '../divisional-chart-test-cases/d10-boundary-cases.json';

describe('Validation Suite — D9 Navamsa Boundary & Mathematical Accuracy', () => {
  it('passes all synthetic D9 boundary test cases', () => {
    for (const testCase of d9BoundaryCases) {
      const result = calculateNavamsaPosition(testCase.inputLongitude);

      expect(result.sign.name, `Failed test ${testCase.id}`).toBe(testCase.expected.d9Sign);
      expect(result.divisionNumber, `Failed division number ${testCase.id}`).toBe(testCase.expected.divisionNumber);

      const isVargottama = result.sign.name === testCase.expected.d1Sign;
      expect(isVargottama, `Failed Vargottama check ${testCase.id}`).toBe(testCase.expected.isVargottama);
    }
  });

  it('verifies mathematical consistency across all 108 Navamsa divisions', () => {
    for (let signIdx = 0; signIdx < 12; signIdx++) {
      for (let divIdx = 0; divIdx < 9; divIdx++) {
        const testLon = signIdx * 30 + divIdx * (30 / 9) + 0.1; // 0.1 deg into division
        const pos = calculateNavamsaPosition(testLon);

        expect(pos.sign).toBeDefined();
        expect(pos.sign.id).toBeGreaterThanOrEqual(1);
        expect(pos.sign.id).toBeLessThanOrEqual(12);
        expect(pos.divisionNumber).toBe(divIdx + 1);
        expect(pos.longitudeInSign).toBeGreaterThanOrEqual(0);
        expect(pos.longitudeInSign).toBeLessThan(30);
      }
    }
  });
});

describe('Validation Suite — D10 Dashamsa Boundary & Mathematical Accuracy', () => {
  it('passes all synthetic D10 boundary test cases', () => {
    for (const testCase of d10BoundaryCases) {
      const result = calculateDashamsaPosition(testCase.inputLongitude);

      expect(result.sign.name, `Failed test ${testCase.id}`).toBe(testCase.expected.d10Sign);
      expect(result.divisionNumber, `Failed division number ${testCase.id}`).toBe(testCase.expected.divisionNumber);

      const sameSign = result.sign.name === testCase.expected.d1Sign;
      expect(sameSign, `Failed same D1/D10 sign check ${testCase.id}`).toBe(testCase.expected.sameD1D10Sign);
    }
  });

  it('verifies mathematical consistency across all 120 Dashamsa divisions', () => {
    for (let signIdx = 0; signIdx < 12; signIdx++) {
      for (let divIdx = 0; divIdx < 10; divIdx++) {
        const testLon = signIdx * 30 + divIdx * (30 / 10) + 0.1; // 0.1 deg into division
        const pos = calculateDashamsaPosition(testLon);

        expect(pos.sign).toBeDefined();
        expect(pos.sign.id).toBeGreaterThanOrEqual(1);
        expect(pos.sign.id).toBeLessThanOrEqual(12);
        expect(pos.divisionNumber).toBe(divIdx + 1);
        expect(pos.longitudeInSign).toBeGreaterThanOrEqual(0);
        expect(pos.longitudeInSign).toBeLessThan(30);
      }
    }
  });
});
