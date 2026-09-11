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

export const PERSONAL_TRANSIT_ASHTAKAVARGA_V1: PersonalTransitAshtakavargaProfile = {
  version: 'personal-transit-ashtakavarga-v1',
  supportedPlanets: ['JUPITER', 'SATURN'],
  savAverage: 337 / 12, // 28.083333333333332
  savAverageBand: {
    belowOffset: -2,
    aboveOffset: 2,
  },
  bavAverageBand: {
    belowOffset: -0.5,
    aboveOffset: 0.5,
  },
};
