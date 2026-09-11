import { TransitCalculationProfile } from './profile.js';
import { TransitAnalysisOutput } from './types.js';
export interface EvaluateTransitOptions {
    transitDate?: Date | string;
    profile?: TransitCalculationProfile;
}
export declare function evaluateTransitEngine(natalChart: any, options?: EvaluateTransitOptions): Promise<TransitAnalysisOutput>;
