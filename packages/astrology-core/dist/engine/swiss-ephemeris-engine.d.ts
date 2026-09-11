import { BirthTimeInput } from '@vedica/shared';
import { AstrologyCalculationEngine } from './astrology-engine.interface.js';
import { BirthChart, ChartInput } from '../types/astrology.js';
import { CalculationProfile } from '../settings/calculation-profile.js';
export declare class SwissEphemerisEngine implements AstrologyCalculationEngine {
    calculateBirthChart(input: ChartInput, profile?: CalculationProfile): Promise<BirthChart>;
}
export declare function calculateAstronomicalSunTimes(input: {
    birthTime: BirthTimeInput;
    location: {
        latitude: number;
        longitude: number;
    };
}): {
    sunriseMinutes: number;
    sunsetMinutes: number;
} | null;
//# sourceMappingURL=swiss-ephemeris-engine.d.ts.map