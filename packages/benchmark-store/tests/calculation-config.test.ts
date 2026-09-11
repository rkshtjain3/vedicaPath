import { describe, it, expect } from 'vitest';
import {
  createAstrologyCalculationConfig,
  detectConfigurationDrift,
  DEFAULT_ASTROLOGY_CALCULATION_CONFIG,
} from '../src/services/calculation-config.js';
import { CalculationInputSnapshot } from '../src/types/benchmark-types.js';

describe('Calculation Configuration Audit & Drift Detection', () => {
  it('should create default astrology calculation config', () => {
    const config = createAstrologyCalculationConfig();
    expect(config.zodiacType).toBe('SIDEREAL');
    expect(config.ayanamsha).toBe('Lahiri');
    expect(config.houseSystem).toBe('Whole Sign');
    expect(config.nodeCalculation).toBe('TRUE');
  });

  it('should detect matching configuration', () => {
    const snapshot: CalculationInputSnapshot = {
      birthDate: '1990-01-01',
      birthTime: '12:00:00',
      timezone: 'Asia/Kolkata',
      utcInstant: '1990-01-01T06:30:00.000Z',
      latitude: 28.6139,
      longitude: 77.209,
      locationName: 'New Delhi',
      calculationProfileVersion: 'personal-vedic-v1',
      calculationConfig: DEFAULT_ASTROLOGY_CALCULATION_CONFIG,
    };

    const drift = detectConfigurationDrift(snapshot, DEFAULT_ASTROLOGY_CALCULATION_CONFIG);
    expect(drift.driftStatus).toBe('MATCH');
  });

  it('should detect configuration drift when ayanamsha changes', () => {
    const snapshot: CalculationInputSnapshot = {
      birthDate: '1990-01-01',
      birthTime: '12:00:00',
      timezone: 'Asia/Kolkata',
      utcInstant: '1990-01-01T06:30:00.000Z',
      latitude: 28.6139,
      longitude: 77.209,
      locationName: 'New Delhi',
      calculationProfileVersion: 'personal-vedic-v1',
      calculationConfig: {
        ...DEFAULT_ASTROLOGY_CALCULATION_CONFIG,
        ayanamsha: 'Raman',
      },
    };

    const drift = detectConfigurationDrift(snapshot, DEFAULT_ASTROLOGY_CALCULATION_CONFIG);
    expect(drift.driftStatus).toBe('CONFIGURATION_CHANGED');
    expect(drift.details).toContain('Ayanamsha (Raman -> Lahiri)');
  });
});
