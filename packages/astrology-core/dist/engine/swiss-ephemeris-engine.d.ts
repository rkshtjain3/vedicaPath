import { AstrologyCalculationEngine } from './astrology-engine.interface.js';
import { BirthChart, ChartInput } from '../types/astrology.js';
import { CalculationProfile } from '../settings/calculation-profile.js';
export declare class SwissEphemerisEngine implements AstrologyCalculationEngine {
    calculateBirthChart(input: ChartInput, profile?: CalculationProfile): Promise<BirthChart>;
}
//# sourceMappingURL=swiss-ephemeris-engine.d.ts.map