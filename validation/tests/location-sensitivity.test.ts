import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { calculateInputFingerprint, calculateReproducibilityHash } from '@vedica/shared';
import { LocationEngine } from '@vedica/location-engine';

describe('Location Sensitivity & Input Fingerprint Regression Suite', () => {
  const engine = new SwissEphemerisEngine();
  const locationEngine = new LocationEngine();

  it('should change calculation fingerprint and Lagna when location is changed from London UK to London ON', async () => {
    const londonUK = await locationEngine.resolveLocation('static:GB:london');
    const londonON = await locationEngine.resolveLocation('static:CA:london_on');

    expect(londonUK.countryCode).toBe('GB');
    expect(londonON.countryCode).toBe('CA');
    expect(londonUK.latitude).not.toBe(londonON.latitude);
    expect(londonUK.longitude).not.toBe(londonON.longitude);
    expect(londonUK.timezone).not.toBe(londonON.timezone);

    const chartUK = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1990-06-15', timeOfBirth: '12:00:00', timezone: londonUK.timezone },
        location: { latitude: londonUK.latitude, longitude: londonUK.longitude, name: londonUK.displayName, timezone: londonUK.timezone },
      },
      PERSONAL_VEDIC_V1
    );

    const chartON = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1990-06-15', timeOfBirth: '12:00:00', timezone: londonON.timezone },
        location: { latitude: londonON.latitude, longitude: londonON.longitude, name: londonON.displayName, timezone: londonON.timezone },
      },
      PERSONAL_VEDIC_V1
    );

    const fpUK = calculateInputFingerprint({
      birthLocalDate: '1990-06-15',
      birthLocalTime: '12:00:00',
      location: { displayName: londonUK.displayName, latitude: londonUK.latitude, longitude: londonUK.longitude, timezone: londonUK.timezone },
      resolvedUTC: chartUK.utcInstant.isoString,
      calculationProfile: PERSONAL_VEDIC_V1.version,
    });

    const fpON = calculateInputFingerprint({
      birthLocalDate: '1990-06-15',
      birthLocalTime: '12:00:00',
      location: { displayName: londonON.displayName, latitude: londonON.latitude, longitude: londonON.longitude, timezone: londonON.timezone },
      resolvedUTC: chartON.utcInstant.isoString,
      calculationProfile: PERSONAL_VEDIC_V1.version,
    });

    expect(fpUK).not.toBe(fpON);
    expect(chartUK.lagna.longitude).not.toBe(chartON.lagna.longitude);
  });

  it('should change input fingerprint when birth time is changed by 1 minute', async () => {
    const input1 = {
      birthLocalDate: '1990-01-01',
      birthLocalTime: '10:30:00',
      location: { displayName: 'New Delhi, India', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      resolvedUTC: '1990-01-01T05:00:00.000Z',
      calculationProfile: 'personal-vedic-v1',
    };

    const input2 = {
      ...input1,
      birthLocalTime: '10:31:00',
      resolvedUTC: '1990-01-01T05:01:00.000Z',
    };

    const fp1 = calculateInputFingerprint(input1);
    const fp2 = calculateInputFingerprint(input2);

    expect(fp1).not.toBe(fp2);
  });

  it('should produce identical fingerprint and reproducibility hash for identical inputs', async () => {
    const input = {
      birthLocalDate: '1990-01-01',
      birthLocalTime: '10:30:00',
      location: { displayName: 'New Delhi, India', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
      resolvedUTC: '1990-01-01T05:00:00.000Z',
      calculationProfile: 'personal-vedic-v1',
    };

    const chart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1990-01-01', timeOfBirth: '10:30:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 28.6139, longitude: 77.209, name: 'New Delhi, India', timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const fp = calculateInputFingerprint(input);
    const planets: Record<string, number> = {};
    for (const p of chart.planets) {
      planets[p.planet] = p.longitude;
    }
    const hash1 = calculateReproducibilityHash(fp, chart.lagna.longitude, planets);
    const hash2 = calculateReproducibilityHash(fp, chart.lagna.longitude, planets);

    expect(hash1).toBe(hash2);
  });
});
