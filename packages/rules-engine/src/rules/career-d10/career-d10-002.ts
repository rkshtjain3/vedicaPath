import { AstrologyRule, AstrologyRuleContext, RuleEvaluation } from '../../types/rule-types.js';
import { PERSONAL_CAREER_D10_RULES_V1, CareerD10RulesProfile } from '../../profiles/career-d10-profile.js';
import { PlanetName, RASHIS } from '@vedica/astrology-core';
import { calculatePlanetDignity, PlanetFact } from '@vedica/analysis-engine';

export class D10Career002Rule implements AstrologyRule {
  id = 'D10-CAREER-002';
  domain = 'CAREER_D10' as const;
  version = '1.0.0';

  evaluate(
    context: AstrologyRuleContext,
    profile: CareerD10RulesProfile = PERSONAL_CAREER_D10_RULES_V1
  ): RuleEvaluation {
    const { d10Chart } = context;

    if (!d10Chart) {
      return {
        ruleId: this.id,
        domain: 'CAREER_D10',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'D10_CHART_NOT_PROVIDED',
      };
    }

    const d10LagnaSign = d10Chart.ascendant.sign;
    const tenthHouseObj = d10Chart.houses.find((h) => h.house === 10);
    const d10TenthSign = tenthHouseObj
      ? tenthHouseObj.sign
      : RASHIS[((d10LagnaSign.id + 10 - 2) % 12)];
    const tenthLord = d10TenthSign.ruler as PlanetName;

    const pos = d10Chart.planets[tenthLord];
    if (!pos) {
      return {
        ruleId: this.id,
        domain: 'CAREER_D10',
        triggered: false,
        effects: [],
        evidence: [],
        explanationKey: 'D10_10TH_LORD_NOT_FOUND',
      };
    }

    const d10LagnaSignId = d10LagnaSign.id;
    const house = ((pos.sign.id - d10LagnaSignId + 12) % 12) + 1;

    const dummyFact: PlanetFact = {
      planet: tenthLord,
      longitude: pos.absoluteLongitude,
      sign: pos.sign.name,
      degreeInSign: pos.longitudeInSign,
      house,
      nakshatra: '',
      pada: 1,
      retrograde: false,
    };
    const dignityResult = calculatePlanetDignity(dummyFact);
    const dignity = dignityResult.primaryDignity;

    const effectClassification =
      profile.ruleEffects['D10-CAREER-002'][dignity] || 'NEUTRAL';

    const whyEvidence: string[] = [
      `D10 10th Lord: ${tenthLord}`,
      `Placed in D10 Sign: ${pos.sign.name} (House ${house})`,
      `Dignity Classification: ${dignity}`,
      `Effect Classification: ${effectClassification}`,
    ];

    return {
      ruleId: this.id,
      domain: 'CAREER_D10',
      triggered: true,
      effects: [],
      evidence: [
        {
          type: 'D10_10TH_LORD_DIGNITY',
          planet: tenthLord,
          dignity,
          effectClassification,
          whyEvidence,
        },
      ],
      explanationKey: 'D10_10TH_LORD_DIGNITY_EVALUATED',
    };
  }
}
