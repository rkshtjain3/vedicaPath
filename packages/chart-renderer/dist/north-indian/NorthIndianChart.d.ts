import React from 'react';
import { ChartViewModel, ChartPlanet, ChartHouse } from '../types/chart-renderer-types.js';
export interface NorthIndianChartProps {
    viewModel: ChartViewModel;
    selectedPlanet?: string | null;
    selectedHouse?: number | null;
    showAspectRays?: boolean;
    onSelectPlanet?: (planet: ChartPlanet) => void;
    onSelectHouse?: (house: ChartHouse) => void;
    className?: string;
}
export declare const NorthIndianChart: React.FC<NorthIndianChartProps>;
