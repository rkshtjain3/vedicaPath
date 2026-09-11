import { BirthChart } from '@vedica/astrology-core';
export interface ChartFact {
    category: 'house' | 'element' | 'modality' | 'planet';
    title: string;
    description: string;
}
export declare function extractChartFacts(chart: BirthChart): ChartFact[];
