import { describe, expect, it } from 'vitest';
import { LocationEngine } from '../src/index.js';

describe('Global Birth Location Integration Suite', () => {
  const engine = new LocationEngine();

  it('resolves India (Panipat, Haryana)', async () => {
    const cities = await engine.searchCities('Panipat', 'IN');
    expect(cities.length).toBeGreaterThan(0);
    const panipat = cities.find((c) => c.city.toLowerCase() === 'panipat');
    expect(panipat).toBeDefined();
    expect(panipat?.countryCode).toBe('IN');
    expect(panipat?.latitude).toBeCloseTo(29.39, 1);
    expect(panipat?.longitude).toBeCloseTo(76.96, 1);
    expect(panipat?.timezone).toBe('Asia/Kolkata');
  });

  it('resolves United States (New York, NY)', async () => {
    const cities = await engine.searchCities('New York', 'US');
    expect(cities.length).toBeGreaterThan(0);
    const ny = cities.find((c) => c.city.toLowerCase().includes('new york'));
    expect(ny).toBeDefined();
    expect(ny?.countryCode).toBe('US');
    expect(ny?.latitude).toBeCloseTo(40.71, 1);
    expect(ny?.longitude).toBeCloseTo(-74.0, 1);
    expect(ny?.timezone).toBe('America/New_York');
  });

  it('resolves United Kingdom (London, England)', async () => {
    const cities = await engine.searchCities('London', 'GB');
    expect(cities.length).toBeGreaterThan(0);
    const london = cities.find((c) => c.city.toLowerCase() === 'london');
    expect(london).toBeDefined();
    expect(london?.countryCode).toBe('GB');
    expect(london?.latitude).toBeCloseTo(51.5, 1);
    expect(london?.longitude).toBeCloseTo(-0.12, 1);
    expect(london?.timezone).toBe('Europe/London');
  });

  it('resolves Australia (Sydney, NSW)', async () => {
    const cities = await engine.searchCities('Sydney', 'AU');
    expect(cities.length).toBeGreaterThan(0);
    const sydney = cities.find((c) => c.city.toLowerCase() === 'sydney');
    expect(sydney).toBeDefined();
    expect(sydney?.countryCode).toBe('AU');
    expect(sydney?.latitude).toBeCloseTo(-33.86, 1);
    expect(sydney?.longitude).toBeCloseTo(151.2, 1);
    expect(sydney?.timezone).toBe('Australia/Sydney');
  });

  it('resolves Canada (Toronto, Ontario)', async () => {
    const cities = await engine.searchCities('Toronto', 'CA');
    expect(cities.length).toBeGreaterThan(0);
    const toronto = cities.find((c) => c.city.toLowerCase() === 'toronto');
    expect(toronto).toBeDefined();
    expect(toronto?.countryCode).toBe('CA');
    expect(toronto?.latitude).toBeCloseTo(43.7, 0);
    expect(toronto?.longitude).toBeCloseTo(-79.38, 0);
    expect(toronto?.timezone).toBe('America/Toronto');
  });

  it('resolves Japan (Tokyo, Kanto)', async () => {
    const cities = await engine.searchCities('Tokyo', 'JP');
    expect(cities.length).toBeGreaterThan(0);
    const tokyo = cities.find((c) => c.city.toLowerCase() === 'tokyo');
    expect(tokyo).toBeDefined();
    expect(tokyo?.countryCode).toBe('JP');
    expect(tokyo?.latitude).toBeCloseTo(35.67, 1);
    expect(tokyo?.longitude).toBeCloseTo(139.65, 1);
    expect(tokyo?.timezone).toBe('Asia/Tokyo');
  });
});
