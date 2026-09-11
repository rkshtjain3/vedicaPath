import { AshtakavargaResult } from '@vedica/ashtakavarga-engine';
import { RelativePositionClassification } from './types.js';
import { PersonalTransitAshtakavargaProfile } from './profile.js';
export interface SavEvaluation {
    signName: string;
    savPoints: number;
    savAverage: number;
    classification: RelativePositionClassification;
}
export declare function evaluateTransitSignSav(ashtakavarga: AshtakavargaResult, signName: string, profile: PersonalTransitAshtakavargaProfile): SavEvaluation;
//# sourceMappingURL=sav-evaluator.d.ts.map