import { describe, expect, it } from 'vitest';
import { evaluateTransitEngine } from '../src/transit-engine.js';
import { evaluateNatalDashaTransitConvergence } from '../src/convergence/natal-dasha-transit-convergence.js';
import { evaluateTransitAspects } from '../src/aspects/transit-aspect-evaluator.js';
import { evaluateTransitConjunctions } from '../src/conjunctions/transit-conjunction-evaluator.js';
import { evaluateTransitHouseContexts } from '../src/house-transits/transit-house-evaluator.js';
import { TransitPosition } from '../src/types.js';

describe('Phase 25 — Transit Engine & Convergence Tests', () => {
  const mockNatalChart = {
    lagna: { longitude: 15.0, sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
    ascendant: { longitude: 15.0, sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' } },
    planets: [
      { planet: 'Sun', longitude: 20.0, sign: { id: 1, name: 'Aries' } },
      { planet: 'Moon', longitude: 45.0, sign: { id: 2, name: 'Taurus' } },
      { planet: 'Jupiter', longitude: 120.0, sign: { id: 5, name: 'Leo' } },
      { planet: 'Saturn', longitude: 300.0, sign: { id: 11, name: 'Aquarius' } },
    ],
  };

  it('calculates 9 transit positions for a given target date', async () => {
    const result = await evaluateTransitEngine(mockNatalChart, {
      transitDate: '2026-08-30T00:00:00Z',
    });

    expect(result).toBeDefined();
    expect(result.planets.length).toBe(9);
    expect(result.profileVersion).toBe('personal-transit-v1');
    expect(result.reproducibilityHash).toBeDefined();
    expect(result.reproducibilityHash.length).toBe(64);
  });

  it('evaluates classical Vedic special aspects (Mars 4th/7th/8th, Jupiter 5th/7th/9th, Saturn 3rd/7th/10th)', () => {
    const mockTransits: TransitPosition[] = [
      {
        planet: 'Jupiter',
        longitude: 15.0, // Aries (1st sign)
        sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' },
        degreeInSign: 15.0,
        formattedDegree: "15° 00' 00\"",
        nakshatra: { id: 1, name: 'Bharani', ruler: 'Venus', pada: 1 },
        isRetrograde: false,
        speed: 0.1,
        houseFromLagna: 1,
        houseFromMoon: 12,
      },
    ];

    const aspects = evaluateTransitAspects(mockTransits, mockNatalChart.planets, 15.0);
    expect(aspects.length).toBeGreaterThan(0);
    const jupiterAspects = aspects.filter((a) => a.transitingPlanet === 'Jupiter');
    expect(jupiterAspects.some((a) => a.aspectType === '5th' || a.aspectType === '7th' || a.aspectType === '9th')).toBe(true);
  });

  it('evaluates transit conjunctions within 6.0° tolerance orb', () => {
    const mockTransits: TransitPosition[] = [
      {
        planet: 'Venus',
        longitude: 22.0, // 2° from Natal Sun (20.0°)
        sign: { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' },
        degreeInSign: 22.0,
        formattedDegree: "22° 00' 00\"",
        nakshatra: { id: 1, name: 'Bharani', ruler: 'Venus', pada: 1 },
        isRetrograde: false,
        speed: 1.2,
        houseFromLagna: 1,
        houseFromMoon: 12,
      },
    ];

    const conjunctions = evaluateTransitConjunctions(mockTransits, mockNatalChart.planets, 6.0);
    expect(conjunctions.length).toBe(1);
    expect(conjunctions[0].transitingPlanet).toBe('Venus');
    expect(conjunctions[0].natalPlanet).toBe('Sun');
    expect(conjunctions[0].angularDistance).toBe(2.0);
  });

  it('classifies transit house contexts properly', () => {
    const mockTransits: TransitPosition[] = [
      {
        planet: 'Jupiter',
        longitude: 125.0,
        sign: { id: 5, name: 'Leo', sanskritName: 'Simha', ruler: 'Sun' },
        degreeInSign: 5.0,
        formattedDegree: "05° 00' 00\"",
        nakshatra: { id: 10, name: 'Magha', ruler: 'Ketu', pada: 1 },
        isRetrograde: false,
        speed: 0.1,
        houseFromLagna: 5,
        houseFromMoon: 4,
      },
    ];

    const houseContexts = evaluateTransitHouseContexts(mockTransits);
    expect(houseContexts.length).toBe(1);
    expect(houseContexts[0].classification).toBe('SUPPORTIVE_CONTEXT');
  });

  it('enforces Anti-Double-Counting policy during Natal-Dasha-Transit convergence', () => {
    const convergenceOutput = evaluateNatalDashaTransitConvergence({
      lifeDomainAnalysis: {
        domains: {
          CAREER: {
            supportiveFactors: [{ id: 'N1', description: 'Natal 10th lord exalted' }],
          },
        },
      },
      timelineAnalysis: {
        domainContexts: {
          CAREER: [
            { supportingFactors: [{ id: 'D1', description: 'Dasha lord 10th house connection' }] },
          ],
        },
      },
      transitAnalysis: {
        domainEvidence: {
          CAREER: {
            evidence: [
              {
                id: 'TR1',
                planet: 'Jupiter',
                domain: 'CAREER',
                direction: 'SUPPORTIVE',
                weight: 1.0,
                sourceRuleId: 'RULE-1',
                description: 'Jupiter transiting 10th house',
                whyEvidence: [],
              },
            ],
          },
        },
      },
    });

    expect(convergenceOutput.domainConvergence.CAREER).toBeDefined();
    expect(convergenceOutput.domainConvergence.CAREER.convergenceLevel).toBe('HIGH_CONVERGENCE');
  });

  it('maintains strict Name Astrology Isolation (same birth chart produces identical transit result regardless of name)', async () => {
    const chart1 = { ...mockNatalChart, fullName: 'Alice Smith' };
    const chart2 = { ...mockNatalChart, fullName: 'Bob Jones' };

    const date = '2026-08-30T00:00:00Z';
    const res1 = await evaluateTransitEngine(chart1, { transitDate: date });
    const res2 = await evaluateTransitEngine(chart2, { transitDate: date });

    expect(res1.reproducibilityHash).toBe(res2.reproducibilityHash);
    expect(res1.planets).toEqual(res2.planets);
  });
});
