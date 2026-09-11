import { BirthChart } from '@vedica/astrology-core';
import { TransitPosition } from '../types/timing-types.js';
export declare class TransitCalculationEngine {
    private cache;
    calculateTransit(instant: Date, natalChart: BirthChart): Promise<TransitPosition[]>;
}
//# sourceMappingURL=transit-calculator.d.ts.map