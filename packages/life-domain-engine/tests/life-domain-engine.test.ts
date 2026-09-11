import { describe, it, expect } from 'vitest';
import { evaluateLifeDomainEngine, PERSONAL_LIFE_DOMAIN_V1 } from '../src/index.js';

describe('@vedica/life-domain-engine', () => {
  const mockEngineData = {
    astrology: {
      planets: [
        { planet: 'Sun', sign: { name: 'Aries' }, house: 10, dignity: 'EXALTED' },
        { planet: 'Saturn', sign: { name: 'Capricorn' }, house: 7, dignity: 'OWN_SIGN' },
        { planet: 'Jupiter', sign: { name: 'Cancer' }, house: 1, dignity: 'EXALTED' },
        { planet: 'Venus', sign: { name: 'Pisces' }, house: 9, dignity: 'EXALTED' },
        { planet: 'Mars', sign: { name: 'Capricorn' }, house: 7, dignity: 'EXALTED' },
        { planet: 'Mercury', sign: { name: 'Virgo' }, house: 3, dignity: 'EXALTED' },
        { planet: 'Ketu', sign: { name: 'Sagittarius' }, house: 9, dignity: 'NEUTRAL' },
      ],
      houses: [],
    },
    analysis: {
      houseLordFacts: [
        { house: 10, lord: 'Sun', lordHouse: 10, dignity: 'EXALTED' },
        { house: 2, lord: 'Jupiter', lordHouse: 1, dignity: 'EXALTED' },
        { house: 11, lord: 'Venus', lordHouse: 9, dignity: 'EXALTED' },
        { house: 7, lord: 'Saturn', lordHouse: 7, dignity: 'OWN_SIGN' },
        { house: 1, lord: 'Moon', lordHouse: 4, dignity: 'NEUTRAL' },
        { house: 4, lord: 'Venus', lordHouse: 9, dignity: 'EXALTED' },
        { house: 5, lord: 'Mars', lordHouse: 7, dignity: 'EXALTED' },
        { house: 9, lord: 'Jupiter', lordHouse: 1, dignity: 'EXALTED' },
        { house: 12, lord: 'Mercury', lordHouse: 3, dignity: 'EXALTED' },
        { house: 6, lord: 'Jupiter', lordHouse: 1, dignity: 'EXALTED' },
      ],
      houseFacts: [
        { house: 10, planets: ['Sun'], sign: { name: 'Aries' } },
        { house: 2, planets: [], sign: { name: 'Leo' } },
        { house: 11, planets: [], sign: { name: 'Taurus' } },
        { house: 7, planets: ['Saturn', 'Mars'], sign: { name: 'Capricorn' } },
        { house: 1, planets: ['Jupiter'], sign: { name: 'Cancer' } },
        { house: 4, planets: [], sign: { name: 'Libra' } },
        { house: 6, planets: [], sign: { name: 'Sagittarius' } },
        { house: 8, planets: [], sign: { name: 'Aquarius' } },
        { house: 9, planets: ['Venus', 'Ketu'], sign: { name: 'Pisces' } },
        { house: 12, planets: [], sign: { name: 'Gemini' } },
      ],
    },
    divisionalCharts: {
      d9Analysis: { ascendantSign: 'Pisces', ascendantLord: 'Jupiter' },
      d10Analysis: { ascendantSign: 'Aries', ascendantLord: 'Mars' },
    },
    strengthAnalysis: {
      planets: [
        { planet: 'Sun', score: 1.5, overallStrength: 'STRONG' },
        { planet: 'Saturn', score: 1.4, overallStrength: 'STRONG' },
        { planet: 'Jupiter', score: 1.8, overallStrength: 'EXCELLENT' },
        { planet: 'Venus', score: 1.6, overallStrength: 'STRONG' },
      ],
    },
    shadbala: {
      planets: [
        { planet: 'Sun', isStrong: true, ratio: 1.4, totalRupa: 7.2 },
        { planet: 'Saturn', isStrong: true, ratio: 1.3, totalRupa: 6.8 },
        { planet: 'Jupiter', isStrong: true, ratio: 1.6, totalRupa: 8.1 },
        { planet: 'Venus', isStrong: true, ratio: 1.5, totalRupa: 7.5 },
        { planet: 'Mars', isStrong: true, ratio: 1.4, totalRupa: 7.0 },
        { planet: 'Mercury', isStrong: true, ratio: 1.5, totalRupa: 7.6 },
        { planet: 'Moon', isStrong: true, ratio: 1.2, totalRupa: 6.0 },
      ],
    },
    ashtakavarga: {
      sav: { 2: 32, 11: 34, 9: 30, 10: 29, 7: 28 },
    },
    yogaAnalysis: {
      yogas: [
        { name: 'Raja Yoga', category: 'Rajayoga', description: 'Power and authority elevation' },
        { name: 'Dhana Yoga', category: 'Dhanayoga', description: 'Wealth accumulation' },
      ],
    },
    rules: {
      careerD10: [{ ruleId: 'CAREER_D10_01', triggered: true, explanationKey: 'D10 10th lord exalted' }],
    },
    dasha: {
      current: {
        mahadasha: { lord: 'Sun' },
        antardasha: { lord: 'Jupiter' },
      },
    },
    timing: {
      transits: {
        planets: [
          { planet: 'Saturn', houseFromLagna: 10, currentSign: { name: 'Aries' } },
          { planet: 'Jupiter', houseFromLagna: 11, currentSign: { name: 'Taurus' } },
        ],
      },
    },
  };

  it('evaluates all 7 domains deterministically', () => {
    const result = evaluateLifeDomainEngine(mockEngineData);

    expect(result.profileVersion).toBe(PERSONAL_LIFE_DOMAIN_V1);
    expect(result.audit.hashKey).toBeDefined();
    expect(Object.keys(result.domains)).toHaveLength(7);

    expect(result.domains.CAREER).toBeDefined();
    expect(result.domains.WEALTH).toBeDefined();
    expect(result.domains.RELATIONSHIPS).toBeDefined();
    expect(result.domains.HEALTH).toBeDefined();
    expect(result.domains.EDUCATION).toBeDefined();
    expect(result.domains.PROPERTY).toBeDefined();
    expect(result.domains.SPIRITUALITY).toBeDefined();
  });

  it('evaluates all 7 domains without INSUFFICIENT_EVIDENCE on canonical chart data', () => {
    const realisticData = {
      astrology: {
        planets: [
          { planet: 'Sun', sign: { name: 'Virgo' }, house: 8, dignity: 'NEUTRAL' },
          { planet: 'Moon', sign: { name: 'Aries' }, house: 3, dignity: 'NEUTRAL' },
          { planet: 'Mars', sign: { name: 'Scorpio' }, house: 10, dignity: 'OWN_SIGN' },
          { planet: 'Mercury', sign: { name: 'Virgo' }, house: 8, dignity: 'EXALTED' },
          { planet: 'Jupiter', sign: { name: 'Capricorn' }, house: 12, dignity: 'DEBILITATED' },
          { planet: 'Venus', sign: { name: 'Libra' }, house: 9, dignity: 'OWN_SIGN' },
          { planet: 'Saturn', sign: { name: 'Pisces' }, house: 2, dignity: 'NEUTRAL' },
          { planet: 'Rahu', sign: { name: 'Leo' }, house: 7, dignity: 'NEUTRAL' },
          { planet: 'Ketu', sign: { name: 'Aquarius' }, house: 1, dignity: 'NEUTRAL' },
        ],
        houses: [],
      },
      analysis: {
        houseLordFacts: [
          { house: 1, lord: 'Saturn', lordHouse: 2, dignity: 'NEUTRAL' },
          { house: 2, lord: 'Jupiter', lordHouse: 12, dignity: 'DEBILITATED' },
          { house: 3, lord: 'Mars', lordHouse: 10, dignity: 'OWN_SIGN' },
          { house: 4, lord: 'Venus', lordHouse: 9, dignity: 'OWN_SIGN' },
          { house: 5, lord: 'Mercury', lordHouse: 8, dignity: 'EXALTED' },
          { house: 6, lord: 'Moon', lordHouse: 3, dignity: 'NEUTRAL' },
          { house: 7, lord: 'Sun', lordHouse: 8, dignity: 'NEUTRAL' },
          { house: 8, lord: 'Mercury', lordHouse: 8, dignity: 'EXALTED' },
          { house: 9, lord: 'Venus', lordHouse: 9, dignity: 'OWN_SIGN' },
          { house: 10, lord: 'Mars', lordHouse: 10, dignity: 'OWN_SIGN' },
          { house: 11, lord: 'Jupiter', lordHouse: 12, dignity: 'DEBILITATED' },
          { house: 12, lord: 'Saturn', lordHouse: 2, dignity: 'NEUTRAL' },
        ],
        houseFacts: [
          { house: 1, planets: ['Ketu'], sign: { name: 'Aquarius' } },
          { house: 2, planets: ['Saturn'], sign: { name: 'Pisces' } },
          { house: 3, planets: ['Moon'], sign: { name: 'Aries' } },
          { house: 4, planets: [], sign: { name: 'Taurus' } },
          { house: 5, planets: [], sign: { name: 'Gemini' } },
          { house: 6, planets: [], sign: { name: 'Cancer' } },
          { house: 7, planets: ['Rahu'], sign: { name: 'Leo' } },
          { house: 8, planets: ['Sun', 'Mercury'], sign: { name: 'Virgo' } },
          { house: 9, planets: ['Venus'], sign: { name: 'Libra' } },
          { house: 10, planets: ['Mars'], sign: { name: 'Scorpio' } },
          { house: 11, planets: [], sign: { name: 'Sagittarius' } },
          { house: 12, planets: ['Jupiter'], sign: { name: 'Capricorn' } },
        ],
      },
      divisionalCharts: {
        d9Chart: { ascendant: { sign: { name: 'Gemini' }, ruler: 'Mercury' } },
        d10Chart: { ascendant: { sign: { name: 'Leo' }, ruler: 'Sun' } },
      },
      shadbala: {
        planets: [
          { planet: 'Sun', partialTotalRupas: 5.8, partialTotalVirupas: 350 },
          { planet: 'Moon', partialTotalRupas: 6.1, partialTotalVirupas: 366 },
          { planet: 'Mars', partialTotalRupas: 7.2, partialTotalVirupas: 432 },
          { planet: 'Mercury', partialTotalRupas: 7.0, partialTotalVirupas: 420 },
          { planet: 'Jupiter', partialTotalRupas: 4.9, partialTotalVirupas: 294 },
          { planet: 'Venus', partialTotalRupas: 6.8, partialTotalVirupas: 410 },
          { planet: 'Saturn', partialTotalRupas: 5.5, partialTotalVirupas: 330 },
        ],
      },
      ashtakavarga: {
        sav: {
          signPoints: {
            Aries: 28,
            Taurus: 31,
            Gemini: 25,
            Cancer: 29,
            Leo: 27,
            Virgo: 33,
            Libra: 32,
            Scorpio: 30,
            Sagittarius: 26,
            Capricorn: 24,
            Aquarius: 28,
            Pisces: 29,
          },
          totalPoints: 342,
        },
      },
      yogaAnalysis: {
        yogas: [],
      },
      rules: {},
      dasha: {
        current: {
          mahadasha: { lord: 'Mercury' },
          antardasha: { lord: 'Venus' },
        },
      },
      timing: {
        transits: {
          planets: [],
        },
      },
    };

    const result = evaluateLifeDomainEngine(realisticData);

    const domainKeys = ['CAREER', 'WEALTH', 'RELATIONSHIPS', 'HEALTH', 'EDUCATION', 'PROPERTY', 'SPIRITUALITY'] as const;
    for (const key of domainKeys) {
      const domain = result.domains[key];
      expect(domain).toBeDefined();
      expect(domain.state, `Domain ${key} should not be INSUFFICIENT_EVIDENCE`).not.toBe('INSUFFICIENT_EVIDENCE');
      const totalFactors = domain.supportingFactors.length + domain.challengingFactors.length + domain.neutralFactors.length;
      expect(totalFactors).toBeGreaterThan(0);
      expect(domain.whyEvidence.length).toBeGreaterThan(0);
      expect(domain.confidence.level).toBeDefined();
    }
  });

  it('includes mandatory health disclaimer on HEALTH domain', () => {
    const result = evaluateLifeDomainEngine(mockEngineData);
    expect(result.domains.HEALTH.disclaimer).toBeDefined();
    expect(result.domains.HEALTH.disclaimer).toContain('not medical advice');
  });

  it('computes audit hash deterministically', () => {
    const run1 = evaluateLifeDomainEngine(mockEngineData);
    const run2 = evaluateLifeDomainEngine(mockEngineData);
    expect(run1.audit.hashKey).toBe(run2.audit.hashKey);
  });
});

