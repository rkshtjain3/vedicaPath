import {
  AstrologyRule,
  AstrologyRuleContext,
  DomainAnalysisResult,
  RatingLevel,
  RuleDomain,
  RulesEngineResult,
} from '../types/rule-types.js';
import { PERSONAL_RULES_V1, RulesProfile } from '../profiles/rules-profile.js';
import { careerRulesList } from '../rules/career/career-rules.js';
import { wealthRulesList } from '../rules/wealth/wealth-rules.js';
import { relationshipRulesList } from '../rules/relationships/relationship-rules.js';
import { propertyRulesList } from '../rules/property/property-rules.js';

const allRulesMap: Record<string, AstrologyRule> = {};

for (const r of [
  ...careerRulesList,
  ...wealthRulesList,
  ...relationshipRulesList,
  ...propertyRulesList,
]) {
  allRulesMap[r.id] = r;
}

export function evaluateRulesEngine(
  context: AstrologyRuleContext,
  profile: RulesProfile = PERSONAL_RULES_V1
): RulesEngineResult {
  const domains: Record<RuleDomain, DomainAnalysisResult> = {
    CAREER: {
      domain: 'CAREER',
      dimensionScores: { Growth: 0, Stability: 0, Change: 0, Responsibility: 0, Challenges: 0 },
      dimensionRatings: { Growth: 'LOW', Stability: 'LOW', Change: 'LOW', Responsibility: 'LOW', Challenges: 'LOW' },
      evaluations: [],
      triggeredRuleIds: [],
    },
    WEALTH: {
      domain: 'WEALTH',
      dimensionScores: { IncomePotential: 0, SavingsPotential: 0, ExpensePressure: 0, FinancialVolatility: 0, AssetBuilding: 0 },
      dimensionRatings: { IncomePotential: 'LOW', SavingsPotential: 'LOW', ExpensePressure: 'LOW', FinancialVolatility: 'LOW', AssetBuilding: 'LOW' },
      evaluations: [],
      triggeredRuleIds: [],
    },
    RELATIONSHIPS: {
      domain: 'RELATIONSHIPS',
      dimensionScores: { RelationshipActivity: 0, Stability: 0, Harmony: 0, Challenges: 0 },
      dimensionRatings: { RelationshipActivity: 'LOW', Stability: 'LOW', Harmony: 'LOW', Challenges: 'LOW' },
      evaluations: [],
      triggeredRuleIds: [],
    },
    PROPERTY: {
      domain: 'PROPERTY',
      dimensionScores: { PropertyActivity: 0, AcquisitionPotential: 0, Stability: 0, Obstacles: 0 },
      dimensionRatings: { PropertyActivity: 'LOW', AcquisitionPotential: 'LOW', Stability: 'LOW', Obstacles: 'LOW' },
      evaluations: [],
      triggeredRuleIds: [],
    },
  };

  const domainList: RuleDomain[] = ['CAREER', 'WEALTH', 'RELATIONSHIPS', 'PROPERTY'];

  for (const domain of domainList) {
    const enabledRuleIds = profile.enabledRules[domain] || [];
    const boundaries = profile.scoringBoundaries[domain];
    const domainResult = domains[domain];

    for (const ruleId of enabledRuleIds) {
      const rule = allRulesMap[ruleId];
      if (!rule) continue;

      const evalResult = rule.evaluate(context);
      domainResult.evaluations.push(evalResult);

      if (evalResult.triggered) {
        domainResult.triggeredRuleIds.push(ruleId);
        for (const effect of evalResult.effects) {
          const currentVal = domainResult.dimensionScores[effect.dimension] || 0;
          domainResult.dimensionScores[effect.dimension] = currentVal + effect.value;
        }
      }
    }

    // Convert dimension scores to RatingLevel
    for (const [dim, score] of Object.entries(domainResult.dimensionScores)) {
      let rating: RatingLevel = 'LOW';
      if (score > boundaries.moderateMax) {
        rating = 'HIGH';
      } else if (score > boundaries.lowMax) {
        rating = 'MODERATE';
      }
      domainResult.dimensionRatings[dim] = rating;
    }
  }

  return {
    rulesProfileVersion: profile.version,
    calculationProfileVersion: profile.calculationProfileVersion,
    analysisProfileVersion: profile.analysisProfileVersion,
    domains,
  };
}
