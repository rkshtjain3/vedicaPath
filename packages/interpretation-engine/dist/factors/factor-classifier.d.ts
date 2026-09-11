import { RuleEvaluation } from '@vedica/rules-engine';
import { TransitEvaluation, MultiLevelDashaActivation } from '@vedica/timing-engine';
import { InterpretationFactor, InterpretationDomain } from '../types/interpretation-types.js';
export declare function classifyRuleEvaluation(evalItem: RuleEvaluation): InterpretationFactor;
export declare function classifyDashaActivations(dashaActivation: MultiLevelDashaActivation, domain: InterpretationDomain): InterpretationFactor[];
export declare function classifyTransitEvaluations(transits: TransitEvaluation[]): InterpretationFactor[];
//# sourceMappingURL=factor-classifier.d.ts.map