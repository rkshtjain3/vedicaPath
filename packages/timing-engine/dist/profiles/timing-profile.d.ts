export interface TimingProfile {
    version: string;
    dashaWeights: {
        MAHADASHA: number;
        ANTARDASHA: number;
        PRATYANTARDASHA: number;
    };
    transitWeights: Record<string, number>;
    enabledTransitRules: string[];
    scoringBoundaries: {
        dashaActivation: {
            MODERATE_MIN: number;
            HIGH_MIN: number;
        };
        transitActivation: {
            MODERATE_MIN: number;
            HIGH_MIN: number;
        };
        combinedActivity: {
            MODERATE_MIN: number;
            HIGH_MIN: number;
        };
    };
}
export declare const PERSONAL_TIMING_V1: TimingProfile;
//# sourceMappingURL=timing-profile.d.ts.map