import { AstrologyRule, AstrologyRuleContext, RuleEvaluation } from '../../types/rule-types.js';
import { CareerD10RulesProfile } from '../../profiles/career-d10-profile.js';
export declare class D10Career001Rule implements AstrologyRule {
    id: string;
    domain: "CAREER_D10";
    version: string;
    evaluate(context: AstrologyRuleContext, profile?: CareerD10RulesProfile): RuleEvaluation;
}
//# sourceMappingURL=career-d10-001.d.ts.map