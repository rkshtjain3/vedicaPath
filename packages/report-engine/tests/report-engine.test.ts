import { describe, it, expect } from 'vitest';
import { generatePersonalReport } from '../src/report-engine.js';
import { PERSONAL_REPORT_V1 } from '../src/profiles/personal-report-profile.js';

describe('Phase 17 — Report Engine Unit Test Suite', () => {
  const mockChart = {
    lagna: {
      sign: 'Sagittarius',
      longitude: 245.5,
      longitudeInSign: 5.5,
      nakshatra: 'Moola',
      pada: 2,
    },
    houseLords: [
      { house: 1, lord: 'Jupiter' },
      { house: 4, lord: 'Jupiter' },
      { house: 7, lord: 'Mercury' },
      { house: 10, lord: 'Mercury' },
    ],
    planets: [
      { planet: 'Sun', sign: 'Virgo', longitude: 156.89, house: 10, isRetrograde: false },
      { planet: 'Moon', sign: 'Taurus', longitude: 45.2, house: 6, isRetrograde: false },
      { planet: 'Mercury', sign: 'Virgo', longitude: 160.1, house: 10, isRetrograde: false },
      { planet: 'Venus', sign: 'Leo', longitude: 135.4, house: 9, isRetrograde: false },
      { planet: 'Mars', sign: 'Cancer', longitude: 105.1, house: 8, isRetrograde: false },
      { planet: 'Jupiter', sign: 'Pisces', longitude: 345.8, house: 4, isRetrograde: false },
      { planet: 'Saturn', sign: 'Aquarius', longitude: 315.2, house: 3, isRetrograde: false },
      { planet: 'Rahu', sign: 'Gemini', longitude: 72.1, house: 7, isRetrograde: true },
      { planet: 'Ketu', sign: 'Sagittarius', longitude: 252.1, house: 1, isRetrograde: true },
    ],
  };

  const mockAnalysis = {
    dignities: [
      { planet: 'Mercury', dignity: 'EXALTED' },
      { planet: 'Jupiter', dignity: 'OWN_SIGN' },
      { planet: 'Mars', dignity: 'DEBILITATED' },
    ],
    combustion: [{ planet: 'Mercury', isCombust: true }],
  };

  const mockYogaAnalysis = {
    totalEvaluated: 24,
    detectedCount: 2,
    results: [
      { id: 'BUDHA_ADITYA_YOGA', name: 'Budha-Aditya Yoga', category: 'SPECIAL', status: 'DETECTED', chartScope: 'D1' },
      { id: 'MALAVYA_YOGA', name: 'Malavya Yoga', category: 'MAHAPURUSHA', status: 'DETECTED', chartScope: 'D1' },
    ],
  };

  const mockStrengthAnalysis = {
    planets: [
      { planet: 'Jupiter', overallStrength: 'STRONG', score: 3.5, d1Dignity: 'OWN_SIGN' },
      { planet: 'Mars', overallStrength: 'WEAK', score: 0.8, d1Dignity: 'DEBILITATED' },
    ],
  };

  const mockShadbala = {
    planetScores: [
      { planet: 'Jupiter', totalShadbalaRupasa: 7.2, percentageOfRequirement: 120, isAdequate: true },
      { planet: 'Mars', totalShadbalaRupasa: 4.5, percentageOfRequirement: 75, isAdequate: false },
    ],
  };

  const mockRules = {
    evaluatedRules: [
      { id: 'rule_10th_lord_strong', title: '10th Lord Strong', category: 'SUPPORTIVE', domain: 'CAREER', active: true, weight: 1.5 },
      { id: 'rule_saturn_aspect_10th', title: 'Saturn Aspecting 10th', category: 'CHALLENGE', domain: 'CAREER', active: true, weight: 1.2 },
    ],
    careerD10: {
      evaluatedRules: [
        { id: 'd10_10th_lord_kendra', title: 'D10 10th Lord Kendra', category: 'SUPPORTIVE', active: true, weight: 1.5 },
      ],
    },
  };

  const mockTiming = {
    dashaActivation: { activeRulers: ['Jupiter', 'Mercury', 'Venus'] },
    domainTimelines: [
      { domain: 'CAREER', status: 'SUPPORTIVE', score: 2.5 },
      { domain: 'WEALTH', status: 'HIGH_ACTIVITY', score: 2.0 },
    ],
  };

  const mockNumerology = {
    lifePath: { finalNumber: 7, isMasterNumber: false },
    birthday: { finalNumber: 5 },
    attitude: { finalNumber: 3 },
    personalYear: 1,
    personalMonth: 9,
    personalDay: 4,
    nameAnalysis: null,
  };

  it('1. generates complete PersonalAstrologyReport with profile version', () => {
    const report = generatePersonalReport(
      {
        chart: mockChart,
        analysis: mockAnalysis,
        yogaAnalysis: mockYogaAnalysis,
        strengthAnalysis: mockStrengthAnalysis,
        shadbala: mockShadbala,
        rules: mockRules,
        timing: mockTiming,
        numerology: mockNumerology,
      },
      PERSONAL_REPORT_V1
    );

    expect(report.profileVersion).toBe('personal-report-v1');
    expect(report.natalOverview).toBeDefined();
    expect(report.planetaryStrength).toBeDefined();
    expect(report.yogas).toBeDefined();
    expect(report.career).toBeDefined();
    expect(report.wealth).toBeDefined();
    expect(report.relationships).toBeDefined();
    expect(report.property).toBeDefined();
    expect(report.timing).toBeDefined();
    expect(report.numerology).toBeDefined();
    expect(report.crossEngineSynthesis).toBeDefined();
  });

  it('2. preserves mixed signals when both supportive and challenging evidence exist', () => {
    const report = generatePersonalReport(
      {
        chart: mockChart,
        analysis: mockAnalysis,
        rules: mockRules,
        timing: mockTiming,
      },
      PERSONAL_REPORT_V1
    );

    expect(report.career.mixedSignals).toBe(true);
    expect(report.career.supportiveEvidence.length).toBeGreaterThan(0);
    expect(report.career.challengingEvidence.length).toBeGreaterThan(0);
  });

  it('3. isolates name numerology when name is omitted vs provided', () => {
    const reportWithoutName = generatePersonalReport(
      {
        chart: mockChart,
        analysis: mockAnalysis,
        numerology: mockNumerology,
      },
      PERSONAL_REPORT_V1
    );

    expect(reportWithoutName.numerology?.summary).toContain('Name-based numerology was not calculated');

    const reportWithName = generatePersonalReport(
      {
        chart: mockChart,
        analysis: mockAnalysis,
        numerology: {
          ...mockNumerology,
          nameAnalysis: {
            expressionNumber: { finalNumber: 1 },
            soulUrgeNumber: { finalNumber: 9 },
            personalityNumber: { finalNumber: 8 },
          },
        },
      },
      PERSONAL_REPORT_V1
    );

    expect(reportWithName.numerology?.summary).toContain('Expression Number: 1');
    // Ensure planetary calculations remain identical
    expect(reportWithoutName.natalOverview.summary).toBe(reportWithName.natalOverview.summary);
  });

  it('4. guarantees non-predictive language in generated report text', () => {
    const report = generatePersonalReport(
      {
        chart: mockChart,
        analysis: mockAnalysis,
        rules: mockRules,
        timing: mockTiming,
      },
      PERSONAL_REPORT_V1
    );

    const fullText = JSON.stringify(report).toLowerCase();
    expect(fullText).not.toContain('you will get rich');
    expect(fullText).not.toContain('you will get married');
    expect(fullText).not.toContain('guaranteed promotion');
  });
});
