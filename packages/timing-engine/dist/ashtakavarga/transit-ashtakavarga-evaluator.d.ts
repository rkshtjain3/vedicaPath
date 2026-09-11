import { BirthChart } from '@vedica/astrology-core';
import { AshtakavargaResult } from '@vedica/ashtakavarga-engine';
import { PersonalTransitAshtakavargaProfile } from './profile.js';
import { TransitAshtakavargaEvaluationResult } from './types.js';
export interface TransitAshtakavargaInput {
    natalChart: BirthChart;
    ashtakavarga: AshtakavargaResult;
    instant?: Date | string;
    profile?: PersonalTransitAshtakavargaProfile;
}
export declare function evaluateTransitAshtakavarga(input: TransitAshtakavargaInput): Promise<TransitAshtakavargaEvaluationResult>;
//# sourceMappingURL=transit-ashtakavarga-evaluator.d.ts.map