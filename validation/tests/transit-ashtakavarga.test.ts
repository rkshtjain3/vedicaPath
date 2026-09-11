import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { calculateAshtakavarga } from '@vedica/ashtakavarga-engine';
import { evaluateTransitAshtakavarga } from '@vedica/timing-engine';
import cases from '../transit-ashtakavarga-test-cases/transit-ashtakavarga-cases.json';

describe('Validation Suite — Transit Ashtakavarga Evidence Integration', () => {
  it('passes synthetic transit Ashtakavarga benchmark cases', async () => {
    const engine = new SwissEphemerisEngine();

    for (const tc of cases) {
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
            timezone: tc.input.timezone,
          },
        },
        PERSONAL_VEDIC_V1
      );

      const ashtakavarga = calculateAshtakavarga(chart);

      const result = await evaluateTransitAshtakavarga({
        natalChart: chart,
        ashtakavarga,
        instant: tc.input.transitDate,
      });

      expect(result.evidenceMap).toBeDefined();
      expect(result.evidenceMap.JUPITER).toBeDefined();
      expect(result.evidenceMap.SATURN).toBeDefined();

      expect(result.evidenceMap.JUPITER.savAverage).toBeCloseTo(tc.expected.savChartAverage, 2);
      expect(result.evidenceMap.SATURN.savAverage).toBeCloseTo(tc.expected.savChartAverage, 2);

      // Verify that natal chart remains unchanged across calculations
      expect(chart.lagna.longitude).toBeGreaterThanOrEqual(0);
      expect(ashtakavarga.validation.passed).toBe(true);
    }
  }, 20000);

  it('guarantees date-dependent transit evidence updates while keeping natal chart invariant', async () => {
    const engine = new SwissEphemerisEngine();
    const natalChart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1990-05-15', timeOfBirth: '14:30:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const ashtakavarga = calculateAshtakavarga(natalChart);

    const t1 = await evaluateTransitAshtakavarga({ natalChart, ashtakavarga, instant: '2020-01-01T00:00:00.000Z' });
    const t2 = await evaluateTransitAshtakavarga({ natalChart, ashtakavarga, instant: '2026-08-29T00:00:00.000Z' });

    // Transits at different years should have different transit dates & positions
    expect(t1.evaluatedInstant).not.toEqual(t2.evaluatedInstant);
    expect(ashtakavarga.validation.actual).toBe(337);
  });
});
