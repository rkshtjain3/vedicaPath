import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { generateMahadashas, getCurrentDasha } from '@vedica/dasha-engine';
import { analyzeChart } from '@vedica/analysis-engine';
import { evaluateRulesEngine, PERSONAL_RULES_V1 } from '@vedica/rules-engine';
import { evaluateTimingEngine, PERSONAL_TIMING_V1 } from '@vedica/timing-engine';
import { evaluateInterpretationEngine, PERSONAL_INTERPRETATION_V1 } from '@vedica/interpretation-engine';

describe('Deterministic Machine Regression Snapshot Suite', () => {
  it('generates reproducible full-pipeline machine snapshot preserving profile versions', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1996-09-23',
          timeOfBirth: '14:30:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          latitude: 28.6139,
          longitude: 77.209,
          timezone: 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const birthDate = new Date(chart.utcInstant.isoString);
    const dashaResult = generateMahadashas({
      birthInstant: birthDate,
      moonLongitude: chart.planets.find((p) => p.planet === 'Moon')!.longitude,
    });

    const testInstant = new Date('2026-08-29T12:00:00.000Z');
    const currentDasha = getCurrentDasha({
      mahadashas: dashaResult.mahadashas,
      instant: testInstant,
    });

    const analysis = analyzeChart(chart);
    const rules = evaluateRulesEngine({ chart, dasha: dashaResult, currentDasha, analysis }, PERSONAL_RULES_V1);
    const timing = await evaluateTimingEngine({
      chart,
      analysis,
      dasha: { mahadashas: dashaResult.mahadashas, current: currentDasha },
      instant: testInstant,
      profile: PERSONAL_TIMING_V1,
    });

    const interpretation = evaluateInterpretationEngine({
      rulesResult: rules,
      timingResult: timing,
      profile: PERSONAL_INTERPRETATION_V1,
    });

    expect(interpretation.calculationProfileVersion).toBe('personal-vedic-v1');
    expect(interpretation.analysisProfileVersion).toBe('personal-analysis-v1');
    expect(interpretation.rulesProfileVersion).toBe('personal-rules-v1');
    expect(interpretation.timingProfileVersion).toBe('personal-timing-v1');
    expect(interpretation.interpretationProfileVersion).toBe('personal-interpretation-v1');

    expect(interpretation.domains.CAREER).toBeDefined();
    expect(interpretation.domains.WEALTH).toBeDefined();
    expect(interpretation.domains.RELATIONSHIPS).toBeDefined();
    expect(interpretation.domains.PROPERTY).toBeDefined();
  });
});
