import { describe, expect, it } from 'vitest';
import {
  LocationEngine,
  searchCountries,
  isValidIANATimezone,
  validateBirthLocation,
  validateLatitude,
  validateLongitude,
  StaticFallbackLocationProvider,
  CompositeLocationProvider,
  LocationCache,
} from '../src/index.js';

describe('Location Engine Package Unit Suite', () => {
  it('searches global countries correctly', () => {
    const indiaResults = searchCountries('india');
    expect(indiaResults.length).toBeGreaterThan(0);
    expect(indiaResults[0].code).toBe('IN');

    const usResults = searchCountries('US');
    expect(usResults.some((c) => c.code === 'US')).toBe(true);

    const allCountries = searchCountries('');
    expect(allCountries.length).toBeGreaterThan(100);
  });

  it('validates IANA timezone strings correctly', () => {
    expect(isValidIANATimezone('Asia/Kolkata')).toBe(true);
    expect(isValidIANATimezone('America/New_York')).toBe(true);
    expect(isValidIANATimezone('Europe/London')).toBe(true);
    expect(isValidIANATimezone('Australia/Sydney')).toBe(true);
    expect(isValidIANATimezone('Invalid/Timezone_Foo')).toBe(false);
  });

  it('validates latitude and longitude boundaries including negative values', () => {
    expect(validateLatitude(29.3909)).toBe(true);
    expect(validateLatitude(-33.8688)).toBe(true);
    expect(validateLatitude(95)).toBe(false);

    expect(validateLongitude(76.9635)).toBe(true);
    expect(validateLongitude(-74.006)).toBe(true);
    expect(validateLongitude(-190)).toBe(false);
  });

  it('validates full BirthLocation structures', () => {
    const valid = validateBirthLocation({
      countryCode: 'IN',
      city: 'Panipat',
      latitude: 29.3909,
      longitude: 76.9635,
      timezone: 'Asia/Kolkata',
    });
    expect(valid.valid).toBe(true);

    const invalid = validateBirthLocation({
      countryCode: 'IN',
      city: '',
      latitude: 100,
      longitude: 76.9635,
      timezone: 'Invalid/TZ',
    });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(1);
  });

  it('searches static fallback provider for duplicate city names', async () => {
    const provider = new StaticFallbackLocationProvider();
    const springfields = await provider.searchCities('Springfield', 'US');
    expect(springfields.length).toBeGreaterThanOrEqual(2);
    expect(springfields.some((s) => s.region === 'Illinois')).toBe(true);
    expect(springfields.some((s) => s.region === 'Massachusetts')).toBe(true);
  });

  it('uses LRU cache for repeated country and city queries', async () => {
    const engine = new LocationEngine();
    const res1 = await engine.searchCities('Panipat', 'IN');
    const res2 = await engine.searchCities('Panipat', 'IN');
    expect(res1).toEqual(res2);
  });

  it('handles fallback provider cleanly when primary provider fails', async () => {
    const mockFailingPrimary = {
      name: 'MOCK_FAILING',
      searchCountries: async () => [],
      searchCities: async () => {
        throw new Error('Network failure');
      },
      resolveLocation: async () => {
        throw new Error('Network failure');
      },
    };

    const composite = new CompositeLocationProvider(
      mockFailingPrimary as any,
      new StaticFallbackLocationProvider()
    );

    const results = await composite.searchCities('London');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.city === 'London')).toBe(true);
  });
});
