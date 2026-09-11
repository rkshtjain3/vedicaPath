import { DomainAnalysisResult } from '@vedica/rules-engine';
import { CombinedActivityWindow, MultiLevelDashaActivation, TransitEvaluation } from '@vedica/timing-engine';
import { DomainInterpretation } from '../../types/interpretation-types.js';
export declare function interpretCareerDomain(params: {
    rulesDomain?: DomainAnalysisResult;
    d10Rules?: any;
    timingStatus?: {
        dashaActivation: MultiLevelDashaActivation;
        transitEvaluations: TransitEvaluation[];
        combinedActivity: 'LOW' | 'MODERATE' | 'HIGH';
        factors: string[];
    };
    timelineWindows?: CombinedActivityWindow[];
}): DomainInterpretation;
//# sourceMappingURL=career-interpretation.d.ts.map