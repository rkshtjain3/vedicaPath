import { BirthChart, ChartInput } from '../types/astrology.js';
import { CalculationProfile } from '../settings/calculation-profile.js';
export interface AstrologyCalculationEngine {
    calculateBirthChart(input: ChartInput, profile?: CalculationProfile): Promise<BirthChart>;
}
//# sourceMappingURL=astrology-engine.interface.d.ts.map