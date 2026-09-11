import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { calculateAshtakavarga, PERSONAL_ASHTAKAVARGA_V1 } from '@vedica/ashtakavarga-engine';

describe('Validation Suite — Ashtakavarga Engine Canonical Accuracy', () => {
  it('validates 337 SAV sum and BAV totals for real birth chart calculation', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1990-05-15',
          timeOfBirth: '14:30:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          name: 'New Delhi, India',
          latitude: 28.6139,
          longitude: 77.209,
          timezone: 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const ashtakavarga = calculateAshtakavarga(chart, PERSONAL_ASHTAKAVARGA_V1);

    expect(ashtakavarga.validation.passed).toBe(true);
    expect(ashtakavarga.validation.expected).toBe(337);
    expect(ashtakavarga.validation.actual).toBe(337);

    // Row-wise checks
    expect(ashtakavarga.bav.SUN.totalPoints).toBe(48);
    expect(ashtakavarga.bav.MOON.totalPoints).toBe(49);
    expect(ashtakavarga.bav.MARS.totalPoints).toBe(39);
    expect(ashtakavarga.bav.MERCURY.totalPoints).toBe(54);
    expect(ashtakavarga.bav.JUPITER.totalPoints).toBe(56);
    expect(ashtakavarga.bav.VENUS.totalPoints).toBe(52);
    expect(ashtakavarga.bav.SATURN.totalPoints).toBe(39);
  });

  it('guarantees deterministic, non-predictive output', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1985-10-25', timeOfBirth: '08:15:00', timezone: 'Asia/Kolkata' },
        location: { name: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const result = calculateAshtakavarga(chart);

    const resultString = JSON.stringify(result);
    expect(resultString).not.toContain('predict');
    expect(resultString).not.toContain('horoscope');
    expect(resultString).not.toContain('destiny');
  });
});
