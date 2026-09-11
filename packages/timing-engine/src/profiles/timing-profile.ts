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

export const PERSONAL_TIMING_V1: TimingProfile = {
  version: 'personal-timing-v1',
  dashaWeights: {
    MAHADASHA: 3,
    ANTARDASHA: 2,
    PRATYANTARDASHA: 1,
  },
  transitWeights: {
    JUPITER: 2,
    SATURN: 2,
  },
  enabledTransitRules: [
    'TRANSIT-001',
    'TRANSIT-002',
    'TRANSIT-003',
    'TRANSIT-004',
    'TRANSIT-005',
    'TRANSIT-006',
  ],
  scoringBoundaries: {
    dashaActivation: {
      MODERATE_MIN: 2,
      HIGH_MIN: 4,
    },
    transitActivation: {
      MODERATE_MIN: 1,
      HIGH_MIN: 3,
    },
    combinedActivity: {
      MODERATE_MIN: 3,
      HIGH_MIN: 6,
    },
  },
};
