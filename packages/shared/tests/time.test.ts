import { describe, it, expect } from 'vitest';
import {
  getUTCInstant,
  resolveLocalTime,
  calculateInputFingerprint,
  calculateReproducibilityHash,
} from '../src/index.js';

describe('Shared Time & Fingerprint Utility Unit Tests', () => {
  it('should correctly resolve valid local time in Asia/Kolkata', () => {
    const res = resolveLocalTime({
      dateOfBirth: '1990-01-01',
      timeOfBirth: '10:30:00',
      timezone: 'Asia/Kolkata',
    });

    expect(res.status).toBe('VALID');
    if (res.status === 'VALID') {
      expect(res.utcInstant.isoString).toBe('1990-01-01T05:00:00Z');
    }
  });

  it('should detect non-existent local time during DST spring forward transition (America/New_York)', () => {
    const res = resolveLocalTime({
      dateOfBirth: '2026-03-08',
      timeOfBirth: '02:30:00',
      timezone: 'America/New_York',
    });

    expect(res.status).toBe('NON_EXISTENT');
  });

  it('should detect ambiguous local time during DST fall back transition (America/New_York)', () => {
    const resFirst = resolveLocalTime(
      {
        dateOfBirth: '2026-11-01',
        timeOfBirth: '01:30:00',
        timezone: 'America/New_York',
      },
      'FIRST'
    );

    const resSecond = resolveLocalTime(
      {
        dateOfBirth: '2026-11-01',
        timeOfBirth: '01:30:00',
        timezone: 'America/New_York',
      },
      'SECOND'
    );

    expect(resFirst.status).toBe('AMBIGUOUS');
    expect(resSecond.status).toBe('AMBIGUOUS');
    if (resFirst.status === 'AMBIGUOUS' && resSecond.status === 'AMBIGUOUS') {
      expect(resFirst.utcInstant.isoString).not.toBe(resSecond.utcInstant.isoString);
    }
  });

  it('should generate consistent input fingerprint and reproducibility hash', () => {
    const auditInput = {
      birthLocalDate: '1990-01-01',
      birthLocalTime: '10:30:00',
      location: {
        displayName: 'New Delhi, Delhi, India',
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
      },
      resolvedUTC: '1990-01-01T05:00:00.000Z',
      calculationProfile: 'personal-vedic-v1',
    };

    const fp1 = calculateInputFingerprint(auditInput);
    const fp2 = calculateInputFingerprint(auditInput);
    expect(fp1).toBe(fp2);
    expect(typeof fp1).toBe('string');
    expect(fp1.length).toBeGreaterThan(10);

    const hash1 = calculateReproducibilityHash(fp1, 120.5, { Sun: 250.2, Moon: 45.1 });
    const hash2 = calculateReproducibilityHash(fp1, 120.5, { Sun: 250.2, Moon: 45.1 });
    expect(hash1).toBe(hash2);
  });
});
