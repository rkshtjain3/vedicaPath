import { describe, expect, it } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { evaluateStrengthEngine } from '@vedica/strength-engine';
import cases from '../strength-test-cases/synthetic-strength-cases.json';

describe('Validation Suite — Planetary Strength & Relationships', () => {
  cases.forEach((tc) => {
    it(`validates ${tc.id}: ${tc.description}`, async () => {
      const engine = new SwissEphemerisEngine();
      const chart = await engine.calculateBirthChart(
        {
          birthTime: {
            dateOfBirth: tc.input.dateOfBirth,
            timeOfBirth: tc.input.timeOfBirth,
            timezone: tc.input.timezone,
          },
          location: {
            latitude: tc.input.latitude,
            longitude: tc.input.longitude,
            name: tc.input.locationName,
            timezone: tc.input.timezone,
          },
        },
        PERSONAL_VEDIC_V1
      );

      const analysis = analyzeChart(chart);
      const d9Chart = calculateDivisionalChart(chart, 'D9');

      const strengthResult = evaluateStrengthEngine(chart, analysis, d9Chart);

      expect(strengthResult.profileVersion).toBe(tc.expected.profileVersion);
      expect(strengthResult.planets.length).toBe(tc.expected.planetCount);
      expect(Object.keys(strengthResult.relationships).length).toBe(tc.expected.relationshipCount);

      // Verify every planet has traceable factors and score
      for (const p of strengthResult.planets) {
        expect(p.score).toBeTypeOf('number');
        expect(p.factors.length).toBeGreaterThan(0);
        expect(p.overallStrength).toBeDefined();

        // Check factor evidence
        for (const factor of p.factors) {
          expect(factor.evidence.length).toBeGreaterThan(0);
          expect(factor.scoreContribution).toBeTypeOf('number');
        }
      }

      // Verify Panchadha Maitri matrix for all classical pairs
      for (const pA of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
        for (const pB of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
          const rel = strengthResult.relationships[pA][pB];
          expect(rel).toBeDefined();
          expect(['GREAT_FRIEND', 'FRIEND', 'NEUTRAL', 'ENEMY', 'GREAT_ENEMY']).toContain(
            rel.compoundRelationship
          );
          expect(rel.explanation).toContain(`${pA} → ${pB}`);
        }
      }
    });
  });
});
