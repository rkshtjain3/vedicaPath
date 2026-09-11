import { describe, it, expect } from 'vitest';
import {
  evaluateInterpretationEngine,
  classifyRuleEvaluation,
  detectMixedSignals,
  calculateConfidence,
  selectAndRenderTemplate,
  PERSONAL_INTERPRETATION_V1,
  InterpretationFactor,
} from '../src/index.js';
import { RulesEngineResult, RuleEvaluation } from '@vedica/rules-engine';

describe('Deterministic Interpretation & Explanation Engine', () => {
  it('classifies supportive, challenging, and neutral rule evaluations correctly', () => {
    const supportiveRule: RuleEvaluation = {
      ruleId: 'CAREER-001',
      domain: 'CAREER',
      triggered: true,
      effects: [{ dimension: 'Growth', value: 3 }],
      evidence: [{ details: '10th lord exalted in 10th house' }],
      explanationKey: 'CAREER_EXALTED',
    };

    const challengingRule: RuleEvaluation = {
      ruleId: 'WEALTH-003',
      domain: 'WEALTH',
      triggered: true,
      effects: [{ dimension: 'Volatilities', value: 2 }],
      evidence: [{ details: '12th house expense pressure' }],
      explanationKey: 'WEALTH_VOLATILE',
    };

    const facSupportive = classifyRuleEvaluation(supportiveRule);
    expect(facSupportive.classification).toBe('SUPPORTIVE');
    expect(facSupportive.sourceId).toBe('CAREER-001');

    const facChallenging = classifyRuleEvaluation(challengingRule);
    expect(facChallenging.classification).toBe('CHALLENGING');
    expect(facChallenging.sourceId).toBe('WEALTH-003');
  });

  it('detects mixed signals when both supportive and challenging factors exist', () => {
    const factors: InterpretationFactor[] = [
      {
        id: 'f1',
        type: 'RULE',
        sourceId: 'CAREER-001',
        title: 'Career growth factor',
        description: 'Growth +3',
        classification: 'SUPPORTIVE',
        evidence: [],
      },
      {
        id: 'f2',
        type: 'RULE',
        sourceId: 'CAREER-005',
        title: 'Saturn 10th house delay factor',
        description: 'Challenges +2',
        classification: 'CHALLENGING',
        evidence: [],
      },
    ];

    const res = detectMixedSignals(factors);
    expect(res.mixedSignals).toBe(true);
    expect(res.supportiveCount).toBe(1);
    expect(res.challengingCount).toBe(1);
  });

  it('calculates framework confidence score and attaches disclaimer', () => {
    const factors: InterpretationFactor[] = [
      { id: '1', type: 'RULE', sourceId: 'R1', title: 'R1', description: '', classification: 'SUPPORTIVE', evidence: [] },
      { id: '2', type: 'DASHA', sourceId: 'D1', title: 'D1', description: '', classification: 'SUPPORTIVE', evidence: [] },
      { id: '3', type: 'TRANSIT', sourceId: 'T1', title: 'T1', description: '', classification: 'SUPPORTIVE', evidence: [] },
      { id: '4', type: 'RULE', sourceId: 'R2', title: 'R2', description: '', classification: 'SUPPORTIVE', evidence: [] },
    ];

    const mixedSignals = detectMixedSignals(factors);
    const conf = calculateConfidence({
      factors,
      mixedSignals,
      hasTimingData: true,
    });

    expect(conf.level).toBe('HIGH');
    expect(conf.score).toBeGreaterThanOrEqual(60);
    expect(conf.disclaimer).toContain('NOT represent scientific probability');
  });

  it('selects parameterized templates avoiding predictive or guaranteed language', () => {
    const tpl = selectAndRenderTemplate({
      domain: 'CAREER',
      activity: 'HIGH',
      supportiveCount: 2,
      challengingCount: 1,
      neutralCount: 0,
    });

    expect(tpl.templateKey).toBe('MIXED_SUPPORTIVE_CHALLENGING');
    expect(tpl.summary).toContain('Career and professional development themes show elevated activity');
    expect(tpl.summary).not.toContain('promoted');
    expect(tpl.summary).not.toContain('definitely');
    expect(tpl.summary).not.toContain('will get');
  });

  it('evaluates full Interpretation Engine across all 4 domains', () => {
    const mockRules: RulesEngineResult = {
      rulesProfileVersion: 'personal-rules-v1',
      calculationProfileVersion: 'personal-vedic-v1',
      analysisProfileVersion: 'personal-analysis-v1',
      domains: {
        CAREER: {
          domain: 'CAREER',
          dimensionScores: { Growth: 5 },
          dimensionRatings: { Growth: 'HIGH' },
          evaluations: [
            {
              ruleId: 'CAREER-001',
              domain: 'CAREER',
              triggered: true,
              effects: [{ dimension: 'Growth', value: 3 }],
              evidence: [{ details: '10th lord exalted' }],
              explanationKey: 'CAREER_EXALTED',
            },
          ],
          triggeredRuleIds: ['CAREER-001'],
        },
        WEALTH: {
          domain: 'WEALTH',
          dimensionScores: { IncomePotential: 3 },
          dimensionRatings: { IncomePotential: 'MODERATE' },
          evaluations: [
            {
              ruleId: 'WEALTH-001',
              domain: 'WEALTH',
              triggered: true,
              effects: [{ dimension: 'IncomePotential', value: 2 }],
              evidence: [{ details: '2nd lord in 11th house' }],
              explanationKey: 'WEALTH_2ND_11TH',
            },
          ],
          triggeredRuleIds: ['WEALTH-001'],
        },
        RELATIONSHIPS: {
          domain: 'RELATIONSHIPS',
          dimensionScores: { RelationshipActivity: 2 },
          dimensionRatings: { RelationshipActivity: 'MODERATE' },
          evaluations: [
            {
              ruleId: 'REL-001',
              domain: 'RELATIONSHIPS',
              triggered: true,
              effects: [{ dimension: 'RelationshipActivity', value: 2 }],
              evidence: [{ details: '7th lord exalted' }],
              explanationKey: 'REL_EXALTED',
            },
          ],
          triggeredRuleIds: ['REL-001'],
        },
        PROPERTY: {
          domain: 'PROPERTY',
          dimensionScores: { PropertyActivity: 1 },
          dimensionRatings: { PropertyActivity: 'LOW' },
          evaluations: [],
          triggeredRuleIds: [],
        },
      },
    };

    const result = evaluateInterpretationEngine({
      rulesResult: mockRules,
      profile: PERSONAL_INTERPRETATION_V1,
    });

    expect(result.interpretationProfileVersion).toBe('personal-interpretation-v1');
    expect(result.domains.CAREER.domain).toBe('CAREER');
    expect(result.domains.CAREER.sources).toContain('CAREER-001');
    expect(result.domains.WEALTH.domain).toBe('WEALTH');
    expect(result.domains.RELATIONSHIPS.domain).toBe('RELATIONSHIPS');
    expect(result.domains.PROPERTY.domain).toBe('PROPERTY');
  });
});
