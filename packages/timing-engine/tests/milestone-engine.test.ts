import { describe, expect, it } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { generateMahadashas } from '@vedica/dasha-engine';
import { calculateLifeMilestones } from '../src/windows/milestone-engine.js';

describe('Milestone Timing Engine', () => {
  const engine = new SwissEphemerisEngine();

  async function getTestSetup() {
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1996-09-23',
          timeOfBirth: '23:00:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          latitude: 29.38747,
          longitude: 76.96825,
          name: 'Panipat, India',
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

    return { chart, analysis, mahadashas: dashaResult.mahadashas };
  }

  it('calculates life milestone windows for property, marriage, and career', async () => {
    const { chart, analysis, mahadashas } = await getTestSetup();
    const result = calculateLifeMilestones({
      chart,
      analysis,
      mahadashas,
      currentDate: new Date('2026-09-01T00:00:00Z'),
    });

    expect(result).toBeDefined();
    expect(result.propertyWindows.length).toBeGreaterThan(0);
    expect(result.marriageWindows.length).toBeGreaterThan(0);
    expect(result.careerWindows.length).toBeGreaterThan(0);

    const firstProp = result.propertyWindows[0];
    expect(firstProp.startDate).toBeDefined();
    expect(firstProp.endDate).toBeDefined();
    expect(firstProp.title).toBeDefined();
    expect(firstProp.titleHi).toBeDefined();
    expect(firstProp.confidence).toBeDefined();
  });
});
