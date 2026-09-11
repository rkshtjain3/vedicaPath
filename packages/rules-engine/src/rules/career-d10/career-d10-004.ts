import { AstrologyRule, AstrologyRuleContext, RuleEvaluation, RuleEvidence } from '../../types/rule-types.js';
import { PERSONAL_CAREER_D10_RULES_V1, CareerD10RulesProfile } from '../../profiles/career-d10-profile.js';
import { getD10HouseCategory } from './house-category-util.js';
import { PlanetName } from '@vedica/astrology-core';
import { calculatePlanetDignity, PlanetFact } from '@vedica/analysis-engine';

export class D10Career004Rule implements AstrologyRule {
  id = 'D10-CAREER-004';
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

    const karakaPlanets: PlanetName[] = ['Sun', 'Saturn', 'Jupiter'];
    const d10LagnaSignId = d10Chart.ascendant.sign.id;
    const evidenceList: RuleEvidence[] = [];

    for (const planet of karakaPlanets) {
      const pos = d10Chart.planets[planet];
      if (!pos) continue;

      const house = ((pos.sign.id - d10LagnaSignId + 12) % 12) + 1;
      const houseCategory = getD10HouseCategory(house);

      const dummyFact: PlanetFact = {
        planet,
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
        profile.ruleEffects['D10-CAREER-004'][dignity] || 'NEUTRAL';

      const whyEvidence: string[] = [
        `Career Karaka: ${planet}`,
        `D10 Placement: House ${house} (${pos.sign.name})`,
        `Dignity: ${dignity.replace('_', ' ')}`,
        `House Category: ${houseCategory}`,
        `Classification: ${effectClassification}`,
      ];

      evidenceList.push({
        type: 'D10_CAREER_KARAKA_PLACEMENT',
        planet,
        d10House: house,
        sign: pos.sign.name,
        dignity,
        houseCategory,
        effectClassification,
        whyEvidence,
      });
    }

    return {
      ruleId: this.id,
      domain: 'CAREER_D10',
      triggered: true,
      effects: [],
      evidence: evidenceList,
      explanationKey: 'D10_CAREER_KARAKAS_EVALUATED',
    };
  }
}
