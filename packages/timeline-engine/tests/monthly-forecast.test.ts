import { describe, it, expect } from 'vitest';
import { generateMonthlyForecast } from '../src/index.js';

describe('Monthly Horoscope & Astrological Forecast Engine', () => {
  const sampleNatalChart = {
    lagna: { sign: { name: 'Scorpio' } },
    moonSign: { name: 'Capricorn' },
    planets: [
      { planet: 'Sun', longitude: 160.5, sign: { name: 'Virgo' } },
      { planet: 'Moon', longitude: 280.2, sign: { name: 'Capricorn' } },
      { planet: 'Mars', longitude: 110.0, sign: { name: 'Cancer' } },
      { planet: 'Mercury', longitude: 155.0, sign: { name: 'Virgo' } },
      { planet: 'Jupiter', longitude: 260.0, sign: { name: 'Sagittarius' } },
      { planet: 'Venus', longitude: 140.0, sign: { name: 'Leo' } },
      { planet: 'Saturn', longitude: 350.0, sign: { name: 'Pisces' } },
      { planet: 'Rahu', longitude: 170.0, sign: { name: 'Virgo' } },
      { planet: 'Ketu', longitude: 350.0, sign: { name: 'Pisces' } },
    ],
  };

  const sampleOptions = {
    targetYear: 2026,
    ashtakavarga: {
      sav: { 1: 30, 2: 26, 3: 31, 4: 28, 5: 35, 6: 27, 7: 29, 8: 24, 9: 32, 10: 34, 11: 36, 12: 25 },
    },
    dashaData: {
      timeline: [
        {
          lord: 'Jupiter',
          startDate: '2020-01-01T00:00:00Z',
          endDate: '2036-01-01T00:00:00Z',
          children: [
            {
              lord: 'Saturn',
              startDate: '2024-06-01T00:00:00Z',
              endDate: '2027-01-01T00:00:00Z',
            },
          ],
        },
      ],
    },
  };

  it('generates 12 distinct months with full astrological metadata', async () => {
    const forecast = await generateMonthlyForecast(sampleNatalChart, sampleOptions);

    expect(forecast.targetYear).toBe(2026);
    expect(forecast.months).toHaveLength(12);
    expect(forecast.peakMonths.length).toBeGreaterThan(0);
    expect(forecast.cautionMonths.length).toBeGreaterThan(0);

    // Check individual month structure
    const sepMonth = forecast.months[8]; // September
    expect(sepMonth.month).toBe(9);
    expect(sepMonth.monthNameEn).toBe('September 2026');
    expect(sepMonth.monthNameHi).toBe('सितंबर 2026');

    // Check Dasha climate
    expect(sepMonth.dashaClimate.mahadashaLord).toBe('Jupiter');
    expect(sepMonth.dashaClimate.antardashaLord).toBe('Saturn');

    // Check Domain Pulse
    expect(sepMonth.domainPulse.career.score).toBeGreaterThan(0);
    expect(sepMonth.domainPulse.wealth.score).toBeGreaterThan(0);
    expect(sepMonth.domainPulse.relationships.score).toBeGreaterThan(0);
    expect(sepMonth.domainPulse.health.score).toBeGreaterThan(0);
    expect(sepMonth.domainPulse.focus.score).toBeGreaterThan(0);

    // Check Cosmic Weather
    expect(sepMonth.cosmicWeather.score).toBeGreaterThan(0);
    expect(sepMonth.cosmicWeather.rating).toBeDefined();

    // Check Solar Ingress & Sankranti
    expect(sepMonth.solarIngress.sankrantiNameEn).toBeDefined();
    expect(sepMonth.solarIngress.sankrantiNameHi).toBeDefined();
    expect(sepMonth.solarIngress.savPoints).toBeDefined();

    // Check Key Dates & Favorable Windows
    expect(sepMonth.keyDates.length).toBeGreaterThan(0);
    expect(sepMonth.favorableWindows.length).toBeGreaterThan(0);
    expect(sepMonth.cautionWindows.length).toBeGreaterThan(0);

    // Check Sattvic Habit Guidance
    expect(sepMonth.sattvicFocus.habitTitleEn).toBeDefined();
    expect(sepMonth.sattvicFocus.habitTitleHi).toBeDefined();

    // Check Traceable Astrological Why
    expect(sepMonth.astrologicalWhy.length).toBeGreaterThan(0);
  }, 25000);
});
