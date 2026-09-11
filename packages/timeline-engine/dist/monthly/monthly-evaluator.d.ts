import { YearlyHoroscopeForecast } from './monthly-types.js';
export interface MonthlyForecastOptions {
    targetYear?: number;
    ashtakavarga?: any;
    shadbala?: any;
    strengthResult?: any;
    dashaData?: any;
}
export declare function generateMonthlyForecast(natalChart: any, options?: MonthlyForecastOptions): Promise<YearlyHoroscopeForecast>;
//# sourceMappingURL=monthly-evaluator.d.ts.map