import { describe, it, expect } from 'vitest';
import { generatePersonalReport, PERSONAL_REPORT_V1 } from '@vedica/report-engine';

describe('Phase 17 — Report Engine Validation Suite', () => {
  const sampleCaseData = {
    chart: {
      lagna: { sign: 'Aries', longitude: 12.5, nakshatra: 'Ashwini', pada: 4 },
      houseLords: [
        { house: 1, lord: 'Mars' },
        { house: 10, lord: 'Saturn' },
      ],
      planets: [
        { planet: 'Sun', sign: 'Aries', house: 1, isRetrograde: false },
        { planet: 'Moon', sign: 'Taurus', house: 2, isRetrograde: false },
        { planet: 'Mars', sign: 'Capricorn', house: 10, isRetrograde: false },
      ],
    },
    analysis: {
      dignities: [
        { planet: 'Sun', dignity: 'EXALTED' },
        { planet: 'Mars', dignity: 'EXALTED' },
      ],
      combustion: [],
    },
    yogaAnalysis: {
      totalEvaluated: 24,
      detectedCount: 1,
      results: [
        { id: 'RUCHAKA_YOGA', name: 'Ruchaka Yoga', category: 'MAHAPURUSHA', status: 'DETECTED' },
      ],
    },
    strengthAnalysis: {
      planets: [{ planet: 'Mars', overallStrength: 'VERY_STRONG', score: 4.0 }],
    },
    shadbala: {
      planetScores: [{ planet: 'Mars', totalShadbalaRupasa: 8.5, percentageOfRequirement: 141, isAdequate: true }],
    },
    rules: {
      evaluatedRules: [
        { id: 'exalted_lagna_lord', title: 'Exalted Lagna Lord', category: 'SUPPORTIVE', domain: 'CAREER', active: true, weight: 2.0 },
      ],
    },
    timing: {
      dashaActivation: { activeRulers: ['Mars', 'Sun'] },
      domainTimelines: [{ domain: 'CAREER', status: 'SUPPORTIVE', score: 3.0 }],
    },
  };

  it('1. validates report generation produces serializable JSON without circular references', () => {
    const report = generatePersonalReport(sampleCaseData, PERSONAL_REPORT_V1);
    const jsonStr = JSON.stringify(report);
    expect(jsonStr).toBeDefined();
    const parsed = JSON.parse(jsonStr);
    expect(parsed.profileVersion).toBe('personal-report-v1');
    expect(parsed.career.convergence.level).toBeDefined();
  });

  it('2. validates cross-engine evidence aggregation across multiple domains', () => {
    const report = generatePersonalReport(sampleCaseData, PERSONAL_REPORT_V1);
    expect(report.crossEngineSynthesis.totalEvidenceItems).toBeGreaterThan(0);
    expect(report.crossEngineSynthesis.totalEnginesEvaluated).toBeGreaterThan(0);
    expect(report.crossEngineSynthesis.overallSummary).toContain('Cross-Engine Synthesis');
  });

  it('3. validates evidenceexplorer traceability for all report sections', () => {
    const report = generatePersonalReport(sampleCaseData, PERSONAL_REPORT_V1);
    expect(Array.isArray(report.natalOverview.evidence)).toBe(true);
    expect(Array.isArray(report.planetaryStrength.evidence)).toBe(true);
    expect(Array.isArray(report.yogas.evidence)).toBe(true);
    expect(Array.isArray(report.career.evidence)).toBe(true);
    expect(Array.isArray(report.wealth.evidence)).toBe(true);
    expect(Array.isArray(report.relationships.evidence)).toBe(true);
    expect(Array.isArray(report.property.evidence)).toBe(true);
    expect(Array.isArray(report.timing.evidence)).toBe(true);
  });
});
