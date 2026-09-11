import { AstrologyRule, AstrologyRuleContext, RuleEvaluation } from '../../types/rule-types.js';
import { PERSONAL_CAREER_D10_RULES_V1, CareerD10RulesProfile } from '../../profiles/career-d10-profile.js';
import { calculateCareerCrossChartFacts } from '@vedica/divisional-chart-engine';

export class D10Career005Rule implements AstrologyRule {
  id = 'D10-CAREER-005';
  domain = 'CAREER_D10' as const;
  version = '1.0.0';

  evaluate(
    context: AstrologyRuleContext,
    profile: CareerD10RulesProfile = PERSONAL_CAREER_D10_RULES_V1
  ): RuleEvaluation {
    const { chart, d10Chart, analysis, d9Chart, careerCrossChart } = context;

    if (!chart || !d10Chart) {
      return {
        ruleId: this.id,
        domain: 'CAREER_D10',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'CHARTS_NOT_PROVIDED',
      };
    }

    const crossFacts =
      careerCrossChart ||
      calculateCareerCrossChartFacts(chart, d10Chart, analysis, d9Chart);

    const d1TenthLordName = crossFacts.d1TenthHouse.lord;
    const d10TenthLordName = crossFacts.d10TenthHouse.lord;
    const samePlanet = d1TenthLordName === d10TenthLordName;

    const d1Fact = crossFacts.d1TenthLord;
    const d10Fact = crossFacts.d10TenthLord;

    const effectKey = samePlanet ? 'SAME_PLANET' : 'DIFFERENT_PLANET';
    const effectClassification =
      profile.ruleEffects['D10-CAREER-005'][effectKey] || 'NEUTRAL';

    const whyEvidence: string[] = [
      `D1 10th Lord: ${d1TenthLordName} (D1 House ${d1Fact.house}, Dignity: ${d1Fact.dignity})`,
      `D10 10th Lord: ${d10TenthLordName} (D10 House ${d10Fact.house}, Dignity: ${d10Fact.dignity})`,
      `Same Career Lord across D1 and D10: ${samePlanet ? 'YES' : 'NO'}`,
      `Classification: ${effectClassification}`,
    ];

    return {
      ruleId: this.id,
      domain: 'CAREER_D10',
      triggered: true,
      effects: [],
      evidence: [
        {
          type: 'D1_D10_CAREER_LORD_RELATIONSHIP',
          d1TenthLord: d1TenthLordName,
          d10TenthLord: d10TenthLordName,
          samePlanet,
          d1Dignity: d1Fact.dignity,
          d10Dignity: d10Fact.dignity,
          d1House: d1Fact.house,
          d10House: d10Fact.house,
          effectClassification,
          whyEvidence,
        },
      ],
      explanationKey: 'D1_D10_CAREER_LORD_RELATIONSHIP_EVALUATED',
    };
  }
}
