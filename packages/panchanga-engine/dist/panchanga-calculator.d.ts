import { BirthChart } from '@vedica/astrology-core';
import { PanchangaResult } from './types/panchanga-types.js';
export interface PanchangaContext {
    chart: BirthChart;
    sunriseMinutes?: number;
    sunsetMinutes?: number;
}
export declare function evaluatePanchanga(context: PanchangaContext): PanchangaResult;
