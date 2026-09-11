import { describe, expect, it } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import {
  evaluateStrengthEngine,
  getCompoundRelationship,
  getHouseCategories,
  computePanchadhaMaitri,
} from '../src/index.js';

describe('Strength Engine Unit Test Suite', () => {
  it('correctly classifies house categories', () => {
    expect(getHouseCategories(1)).toEqual(['KENDRA', 'TRIKONA']);
    expect(getHouseCategories(10)).toEqual(['KENDRA', 'UPACHAYA']);
    expect(getHouseCategories(6)).toEqual(['UPACHAYA', 'DUSTHANA']);
    expect(getHouseCategories(8)).toEqual(['DUSTHANA']);
    expect(getHouseCategories(5)).toEqual(['TRIKONA']);
  });

  it('correctly calculates Panchadha Maitri compound relationships', () => {
    // Natural Friend + Temp Friend = Great Friend
    expect(computePanchadhaMaitri('FRIEND', 'FRIEND')).toBe('GREAT_FRIEND');
    // Natural Friend + Temp Enemy = Neutral
    expect(computePanchadhaMaitri('FRIEND', 'ENEMY')).toBe('NEUTRAL');
    // Natural Neutral + Temp Friend = Friend
    expect(computePanchadhaMaitri('NEUTRAL', 'FRIEND')).toBe('FRIEND');
    // Natural Neutral + Temp Enemy = Enemy
    expect(computePanchadhaMaitri('NEUTRAL', 'ENEMY')).toBe('ENEMY');
    // Natural Enemy + Temp Friend = Neutral
    expect(computePanchadhaMaitri('ENEMY', 'FRIEND')).toBe('NEUTRAL');
    // Natural Enemy + Temp Enemy = Great Enemy
    expect(computePanchadhaMaitri('ENEMY', 'ENEMY')).toBe('GREAT_ENEMY');
  });

  it('runs complete strength analysis on a real natal chart', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1990-01-01',
          timeOfBirth: '10:30:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          latitude: 28.6139,
          longitude: 77.209,
          name: 'New Delhi, India',
          timezone: 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const analysis = analyzeChart(chart);
    const d9Chart = calculateDivisionalChart(chart, 'D9');

    const result = evaluateStrengthEngine(chart, analysis, d9Chart);

    expect(result.profileVersion).toBe('personal-strength-v1');
    expect(result.planets.length).toBe(7);

    // Verify Jupiter strength analysis
    const jupiter = result.planets.find((p) => p.planet === 'Jupiter')!;
    expect(jupiter).toBeDefined();
    expect(jupiter.factors.length).toBeGreaterThan(0);
    expect(jupiter.score).toBeTypeOf('number');
    expect(['VERY_STRONG', 'STRONG', 'MODERATE', 'WEAK', 'VERY_WEAK']).toContain(
      jupiter.overallStrength
    );

    // Verify Relationship Matrix
    expect(result.relationships.Jupiter.Sun.compoundRelationship).toBeDefined();
    expect(result.relationships.Jupiter.Sun.explanation).toContain('Jupiter → Sun');
  });
});
