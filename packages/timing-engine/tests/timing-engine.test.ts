import { describe, expect, it } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { generateMahadashas, getCurrentDasha } from '@vedica/dasha-engine';
import {
  evaluateMultiLevelDashaActivation,
  TransitCalculationEngine,
  evaluateTransitRules,
  getDomainDashaTimeline,
  evaluateTimingEngine,
  PERSONAL_TIMING_V1,
} from '../src/index.js';

describe('Astrology Timing & Transit Engine', () => {
  const engine = new SwissEphemerisEngine();

  async function getTestSetup() {
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1990-01-01',
          timeOfBirth: '12:00:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          latitude: 28.6139,
          longitude: 77.209,
          name: 'New Delhi',
          timezone: 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const analysis = analyzeChart(chart);
    const moonPlanet = chart.planets.find((p) => p.planet === 'Moon')!;
    const dashaResult = generateMahadashas({
      birthInstant: new Date(chart.utcInstant.isoString),
      moonLongitude: moonPlanet.longitude,
    });

    const currentDasha = getCurrentDasha({
      mahadashas: dashaResult.mahadashas,
      instant: new Date('2026-01-01T00:00:00Z'),
    });

    return { chart, analysis, dashaResult, currentDasha };
  }

  it('evaluates multi-level Dasha activation with proper weights', async () => {
    const { analysis } = await getTestSetup();

    const activation = evaluateMultiLevelDashaActivation(
      {
        mahadasha: { lord: 'Saturn' },
        antardasha: { lord: 'Mercury' },
        pratyantardasha: { lord: 'Jupiter' },
      },
      'CAREER',
      analysis,
      PERSONAL_TIMING_V1
    );

    expect(activation.domain).toBe('CAREER');
    expect(activation.mahadasha.dashaLevel).toBe('MAHADASHA');
    expect(activation.antardasha.dashaLevel).toBe('ANTARDASHA');
    expect(activation.pratyantardasha.dashaLevel).toBe('PRATYANTARDASHA');

    // Score is sum of weighted connections (MD=3, AD=2, PD=1)
    const expectedScore =
      (activation.mahadasha.connected ? 3 : 0) +
      (activation.antardasha.connected ? 2 : 0) +
      (activation.pratyantardasha.connected ? 1 : 0);

    expect(activation.totalScore).toBe(expectedScore);
  });

  it('reproducibly calculates transit positions for 9 planets', async () => {
    const { chart } = await getTestSetup();
    const transitEngine = new TransitCalculationEngine();
    const instant = new Date('2026-06-15T12:00:00Z');

    const transits1 = await transitEngine.calculateTransit(instant, chart);
    const transits2 = await transitEngine.calculateTransit(instant, chart);

    expect(transits1.length).toBe(9);
    expect(transits1[0].planet).toBe('Sun');
    expect(transits1[0].longitude).toBe(transits2[0].longitude);
    expect(transits1[0].natalHouse).toBeGreaterThanOrEqual(1);
    expect(transits1[0].natalHouse).toBeLessThanOrEqual(12);
  });

  it('evaluates transit rules TRANSIT-001 to TRANSIT-006 correctly', () => {
    const mockTransits: any[] = [
      { planet: 'Jupiter', signName: 'Capricorn', natalHouse: 10, isRetrograde: false },
      { planet: 'Saturn', signName: 'Aquarius', natalHouse: 4, isRetrograde: false },
    ];

    const evals = evaluateTransitRules(mockTransits, PERSONAL_TIMING_V1);
    const t1 = evals.find((e) => e.ruleId === 'TRANSIT-001')!;
    const t6 = evals.find((e) => e.ruleId === 'TRANSIT-006')!;
    const t4 = evals.find((e) => e.ruleId === 'TRANSIT-004')!;

    expect(t1.triggered).toBe(true);
    expect(t1.domain).toBe('CAREER');

    expect(t6.triggered).toBe(true);
    expect(t6.domain).toBe('PROPERTY');

    expect(t4.triggered).toBe(false);
    expect(t4.domain).toBe('RELATIONSHIPS');
  });

  it('generates domain Dasha timeline with contiguous period merging', async () => {
    const { chart, analysis, dashaResult } = await getTestSetup();

    const timeline = getDomainDashaTimeline({
      chart,
      analysis,
      mahadashas: dashaResult.mahadashas,
      domain: 'CAREER',
      start: new Date('2020-01-01'),
      end: new Date('2030-01-01'),
      profile: PERSONAL_TIMING_V1,
    });

    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline[0].start).toBeDefined();
    expect(timeline[0].end).toBeDefined();
    expect(timeline[0].activity).toMatch(/LOW|MODERATE|HIGH/);
  });

  it('evaluates complete Timing Engine status & version tracking', async () => {
    const { chart, analysis, dashaResult, currentDasha } = await getTestSetup();

    const res = await evaluateTimingEngine({
      chart,
      analysis,
      dasha: {
        mahadashas: dashaResult.mahadashas,
        current: currentDasha,
      },
      instant: new Date('2026-01-01'),
      profile: PERSONAL_TIMING_V1,
    });

    expect(res.timingProfileVersion).toBe('personal-timing-v1');
    expect(res.rulesProfileVersion).toBe('personal-rules-v1');
    expect(res.analysisProfileVersion).toBe('personal-analysis-v1');

    expect(res.currentStatus.CAREER).toBeDefined();
    expect(res.currentStatus.WEALTH).toBeDefined();
    expect(res.currentStatus.RELATIONSHIPS).toBeDefined();
    expect(res.currentStatus.PROPERTY).toBeDefined();

    expect(res.timelines.CAREER.length).toBeGreaterThan(0);
  });
});
