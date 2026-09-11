import { AshtakavargaResult } from '@vedica/ashtakavarga-engine';
import { RelativePositionClassification } from './types.js';
import { PersonalTransitAshtakavargaProfile } from './profile.js';
export interface BavEvaluation {
    planet: string;
    signName: string;
    bavPoints: number;
    bavAverage: number;
    totalPoints: number;
    classification: RelativePositionClassification;
}
export declare function evaluatePlanetBav(ashtakavarga: AshtakavargaResult, planet: string, signName: string, profile: PersonalTransitAshtakavargaProfile): BavEvaluation;
//# sourceMappingURL=bav-evaluator.d.ts.map