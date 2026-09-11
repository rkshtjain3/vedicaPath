import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { calculateAshtakavarga, PERSONAL_ASHTAKAVARGA_V1 } from '@vedica/ashtakavarga-engine';
import {
  evaluateTransitAshtakavarga,
  evaluatePlanetBav,
  evaluateTransitSignSav,
  PERSONAL_TRANSIT_ASHTAKAVARGA_V1,
} from '../src/index.js';

describe('Timing Engine — Transit Ashtakavarga Evidence Unit Tests', () => {
  it('correctly evaluates Jupiter and Saturn transit BAV & SAV bindus', async () => {
    const engine = new SwissEphemerisEngine();
    const natalChart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1990-05-15', timeOfBirth: '14:30:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const ashtakavarga = calculateAshtakavarga(natalChart, PERSONAL_ASHTAKAVARGA_V1);

    const result = await evaluateTransitAshtakavarga({
      natalChart,
      ashtakavarga,
      instant: '2026-08-29T12:00:00.000Z',
      profile: PERSONAL_TRANSIT_ASHTAKAVARGA_V1,
    });

    expect(result.evidenceMap).toBeDefined();
    expect(result.evidenceMap.JUPITER).toBeDefined();
    expect(result.evidenceMap.SATURN).toBeDefined();

    const jupiterEv = result.evidenceMap.JUPITER;
    expect(jupiterEv.transitPlanet).toBe('JUPITER');
    expect(jupiterEv.transitHouseFromLagna).toBeGreaterThanOrEqual(1);
    expect(jupiterEv.transitHouseFromLagna).toBeLessThanOrEqual(12);
    expect(jupiterEv.bavPoints).toBeGreaterThanOrEqual(0);
    expect(jupiterEv.savPoints).toBeGreaterThanOrEqual(0);
    expect(jupiterEv.bavAverage).toBeCloseTo(56 / 12, 1);
    expect(jupiterEv.savAverage).toBeCloseTo(337 / 12, 1);
    expect(['BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE']).toContain(jupiterEv.bavRelativePosition);
    expect(['BELOW_AVERAGE', 'AVERAGE', 'ABOVE_AVERAGE']).toContain(jupiterEv.savRelativePosition);
    expect(jupiterEv.evidence.length).toBeGreaterThan(5);
  });

  it('supports historical and future transit dates correctly', async () => {
    const engine = new SwissEphemerisEngine();
    const natalChart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1985-10-25', timeOfBirth: '08:15:00', timezone: 'Europe/London' },
        location: { latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
      },
      PERSONAL_VEDIC_V1
    );

    const ashtakavarga = calculateAshtakavarga(natalChart);

    // Historical Date: 1947-08-15
    const pastResult = await evaluateTransitAshtakavarga({
      natalChart,
      ashtakavarga,
      instant: '1947-08-15T00:00:00.000Z',
    });

    // Future Date: 2040-05-01
    const futureResult = await evaluateTransitAshtakavarga({
      natalChart,
      ashtakavarga,
      instant: '2040-05-01T00:00:00.000Z',
    });

    expect(pastResult.evidenceMap.JUPITER.transitDate).toBe('1947-08-15T00:00:00.000Z');
    expect(futureResult.evidenceMap.JUPITER.transitDate).toBe('2040-05-01T00:00:00.000Z');
    // Transits at different dates may occupy different signs
    expect(pastResult.evidenceMap.JUPITER.transitSign.name).toBeDefined();
    expect(futureResult.evidenceMap.JUPITER.transitSign.name).toBeDefined();
  });

  it('guarantees deterministic, non-predictive evidence output', async () => {
    const engine = new SwissEphemerisEngine();
    const natalChart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1990-05-15', timeOfBirth: '14:30:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const ashtakavarga = calculateAshtakavarga(natalChart);
    const result = await evaluateTransitAshtakavarga({ natalChart, ashtakavarga, instant: '2026-08-29T12:00:00.000Z' });

    const str = JSON.stringify(result);
    expect(str).not.toContain('predict');
    expect(str).not.toContain('horoscope');
    expect(str).not.toContain('destiny');
    expect(str).not.toContain('lucky');
  });

  it('correctly classifies below, average, and above average positions relative to profile bands', () => {
    const mockAshtakavarga: any = {
      bav: {
        JUPITER: {
          totalPoints: 56,
          signPoints: { Leo: 2, Virgo: 5, Libra: 8 },
        },
      },
      sav: {
        signPoints: { Leo: 20, Virgo: 28, Libra: 35 },
      },
    };

    const jupiterBavLeo = evaluatePlanetBav(mockAshtakavarga, 'JUPITER', 'Leo', PERSONAL_TRANSIT_ASHTAKAVARGA_V1);
    expect(jupiterBavLeo.classification).toBe('BELOW_AVERAGE'); // 2 < 4.67 - 0.5

    const jupiterBavVirgo = evaluatePlanetBav(mockAshtakavarga, 'JUPITER', 'Virgo', PERSONAL_TRANSIT_ASHTAKAVARGA_V1);
    expect(jupiterBavVirgo.classification).toBe('AVERAGE'); // 5 is around 4.67

    const jupiterBavLibra = evaluatePlanetBav(mockAshtakavarga, 'JUPITER', 'Libra', PERSONAL_TRANSIT_ASHTAKAVARGA_V1);
    expect(jupiterBavLibra.classification).toBe('ABOVE_AVERAGE'); // 8 > 4.67 + 0.5

    const savLeo = evaluateTransitSignSav(mockAshtakavarga, 'Leo', PERSONAL_TRANSIT_ASHTAKAVARGA_V1);
    expect(savLeo.classification).toBe('BELOW_AVERAGE'); // 20 < 28.08 - 2

    const savVirgo = evaluateTransitSignSav(mockAshtakavarga, 'Virgo', PERSONAL_TRANSIT_ASHTAKAVARGA_V1);
    expect(savVirgo.classification).toBe('AVERAGE'); // 28 is around 28.08

    const savLibra = evaluateTransitSignSav(mockAshtakavarga, 'Libra', PERSONAL_TRANSIT_ASHTAKAVARGA_V1);
    expect(savLibra.classification).toBe('ABOVE_AVERAGE'); // 35 > 28.08 + 2
  });
});
