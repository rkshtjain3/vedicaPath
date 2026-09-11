import { describe, it, expect } from 'vitest';
import {
  validateReferenceProvenance,
  detectSelfReferencing,
} from '../src/services/provenance-validator.js';

describe('Phase 20 Provenance Hardening & Anti-Self-Referencing Guard', () => {
  it('should reject VERIFIED status if required provenance fields are missing', () => {
    const incompleteProvenance = {
      sourceSoftware: 'Jagannatha Hora',
      verificationStatus: 'VERIFIED' as const,
    };

    const res = validateReferenceProvenance(incompleteProvenance);
    expect(res.valid).toBe(false);
    expect(res.effectiveStatus).toBe('UNVERIFIED');
    expect(res.errors.length).toBeGreaterThan(0);
  });

  it('should accept VERIFIED status when all mandatory provenance fields are provided', () => {
    const fullProvenance = {
      sourceSoftware: 'Jagannatha Hora',
      sourceVersion: '8.0',
      sourceDate: '2026-08-30',
      sourceConfiguration: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL' },
      dataEntryMethod: 'VERIFIED_SOFTWARE_BENCHMARK',
      referenceCapturedBy: 'Audit Team',
      verificationStatus: 'VERIFIED' as const,
    };

    const res = validateReferenceProvenance(fullProvenance);
    expect(res.valid).toBe(true);
    expect(res.effectiveStatus).toBe('VERIFIED');
    expect(res.errors.length).toBe(0);
  });

  it('should detect anti-self-referencing when submitted reference longitudes match internal engine output identically to 6 decimal places', () => {
    const actualChartOutputs = {
      ascendant: { longitude: 100.5302 },
      planets: [
        { planet: 'Sun', longitude: 60.3121 },
        { planet: 'Moon', longitude: 22.5193 },
        { planet: 'Mars', longitude: 70.1309 },
        { planet: 'Mercury', longitude: 69.4056 },
        { planet: 'Jupiter', longitude: 293.1478 },
        { planet: 'Venus', longitude: 14.5854 },
        { planet: 'Saturn', longitude: 209.0792 },
        { planet: 'Rahu', longitude: 24.2191 },
        { planet: 'Ketu', longitude: 204.2191 },
      ],
    };

    const selfReferenceValues = {
      astrology: {
        ascendantLongitude: 100.5302,
        planetaryLongitudes: {
          Sun: 60.3121,
          Moon: 22.5193,
          Mars: 70.1309,
          Mercury: 69.4056,
          Jupiter: 293.1478,
          Venus: 14.5854,
          Saturn: 209.0792,
          Rahu: 24.2191,
          Ketu: 204.2191,
        },
      },
    };

    const check = detectSelfReferencing(selfReferenceValues, actualChartOutputs);
    expect(check.isSelfReferenced).toBe(true);
    expect(check.reason).toContain('Anti-Self-Referencing Guard');
  });

  it('should NOT flag anti-self-referencing when reference longitudes differ from internal engine', () => {
    const actualChartOutputs = {
      ascendant: { longitude: 100.5302 },
      planets: [
        { planet: 'Sun', longitude: 60.3121 },
        { planet: 'Moon', longitude: 22.5193 },
        { planet: 'Mars', longitude: 70.1309 },
      ],
    };

    const externalRef = {
      astrology: {
        ascendantLongitude: 100.5302,
        planetaryLongitudes: {
          Sun: 60.3200, // Different value
          Moon: 22.5100,
          Mars: 70.1400,
        },
      },
    };

    const check = detectSelfReferencing(externalRef, actualChartOutputs);
    expect(check.isSelfReferenced).toBe(false);
  });
});
