import { BirthChart } from '@vedica/astrology-core';
export interface DualChartRenderOptions {
    chartA: BirthChart;
    nameA: string;
    chartB: BirthChart;
    nameB: string;
    style?: 'NORTH_INDIAN' | 'SOUTH_INDIAN';
}
export declare function renderDualChartSVG(options: DualChartRenderOptions): string;
