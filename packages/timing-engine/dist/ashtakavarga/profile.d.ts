import { TransitAshtakavargaPlanet } from './types.js';
export interface PersonalTransitAshtakavargaProfile {
    version: string;
    supportedPlanets: TransitAshtakavargaPlanet[];
    savAverage: number;
    savAverageBand: {
        belowOffset: number;
        aboveOffset: number;
    };
    bavAverageBand: {
        belowOffset: number;
        aboveOffset: number;
    };
}
export declare const PERSONAL_TRANSIT_ASHTAKAVARGA_V1: PersonalTransitAshtakavargaProfile;
//# sourceMappingURL=profile.d.ts.map