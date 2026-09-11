import { ChartViewModel, ChartStyle, ChartType } from '../types/chart-renderer-types.js';
export declare function buildChartViewModelFromD1(chartData: any, style?: ChartStyle): ChartViewModel;
export declare function buildChartViewModelFromDivisional(divChartData: any, chartType?: ChartType, style?: ChartStyle): ChartViewModel;
export declare function buildChartViewModel(calculationResult: any, chartType?: ChartType, style?: ChartStyle, options?: {
    showTransitOverlay?: boolean;
    transitData?: any;
}): ChartViewModel;
