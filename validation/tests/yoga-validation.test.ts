import { describe, expect, it } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { evaluateYogaEngine, PERSONAL_YOGA_V1 } from '@vedica/yoga-engine';
import mahapurushaCases from '../yoga-test-cases/mahapurusha-cases.json';
import rajaCases from '../yoga-test-cases/raja-cases.json';
import specialCases from '../yoga-test-cases/special-cases.json';

describe('Yoga Engine Integration Validation', () => {
  const allCases = [...mahapurushaCases, ...rajaCases, ...specialCases];
  const engine = new SwissEphemerisEngine();

  allCases.forEach((tc) => {
    it(`validates test case: ${tc.name} (${tc.id})`, async () => {
      const chart = await engine.calculateBirthChart(
        {
          birthTime: {
            dateOfBirth: tc.birthTime.dateOfBirth,
            timeOfBirth: tc.birthTime.timeOfBirth,
            timezone: tc.birthTime.timezone,
          },
          location: {
            name: tc.location.name,
            latitude: tc.location.latitude,
            longitude: tc.location.longitude,
            timezone: tc.location.timezone,
          },
        },
        PERSONAL_VEDIC_V1
      );

      const analysis = analyzeChart(chart);
      const yogaAnalysis = evaluateYogaEngine(chart, analysis, PERSONAL_YOGA_V1);

      expect(yogaAnalysis.totalEvaluated).toBe(24);

      const detectedIds = yogaAnalysis.results
        .filter((r) => r.detected)
        .map((r) => r.id);

      tc.expectedDetectedYogas.forEach((expectedId) => {
        expect(detectedIds).toContain(expectedId);
      });

      tc.expectedUndetectedYogas.forEach((notExpectedId) => {
        expect(detectedIds).not.toContain(notExpectedId);
      });
    });
  });
});
