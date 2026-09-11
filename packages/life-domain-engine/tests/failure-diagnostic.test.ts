import { describe, expect, it } from 'vitest';
import { diagnoseStruggleAndFailure } from '../src/evaluators/failure-diagnostic-engine.js';

describe('Failure & Struggle Diagnostic Engine', () => {
  function getTestSetup() {
    const chart: any = {
      moonSign: { sign: 'Pisces' },
      ascendant: { sign: 'Gemini' },
      planets: [
        { planet: 'Moon', sign: 'Pisces' },
        { planet: 'Saturn', sign: 'Pisces' },
      ],
    };

    const analysis: any = {
      houseLordFacts: [],
      houseFacts: [],
    };

    const currentDasha = {
      mahadasha: { planet: 'Saturn' },
      antardasha: { planet: 'Rahu', endDate: '2027-04-15T00:00:00Z' },
    };

    const transitAnalysis = {
      planets: [{ name: 'Saturn', sign: 'Pisces' }],
    };

    return { chart, analysis, currentDasha, transitAnalysis };
  }

  it('diagnoses causes for active struggle, Sade Sati / Rahu, and provides relief timeline', () => {
    const { chart, analysis, currentDasha, transitAnalysis } = getTestSetup();
    const result = diagnoseStruggleAndFailure({
      chart,
      analysis,
      currentDasha,
      transitAnalysis,
    });

    expect(result).toBeDefined();
    expect(result.statusHeadline).toBeDefined();
    expect(result.statusHeadlineHi).toBeDefined();
    expect(result.rootExplanation).toBeDefined();
    expect(result.karmicLesson).toBeDefined();
    expect(result.activeCauses.length).toBeGreaterThan(0);
    expect(result.reliefDate).toBe('2027-04-15');
    expect(result.actionProtocol.length).toBe(3);
  });
});
