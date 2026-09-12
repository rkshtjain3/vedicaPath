import { BirthChart } from '../types/astrology.js';
import { LocationInput } from '@vedica/shared';
export interface PrashnaQueryInput {
    question: string;
    location: LocationInput;
    queryInstantIso?: string;
}
export interface PrashnaChartResult {
    question: string;
    queryInstantIso: string;
    chart: BirthChart;
    prashnaLagnaSign: string;
    prashnaLagnaLord: string;
}
export declare function calculatePrashnaChart(input: PrashnaQueryInput): Promise<PrashnaChartResult>;
//# sourceMappingURL=prashna-engine.d.ts.map