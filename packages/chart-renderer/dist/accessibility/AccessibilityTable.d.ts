import React from 'react';
import { ChartViewModel, ChartHouse, ChartPlanet } from '../types/chart-renderer-types.js';
export interface AccessibilityTableProps {
    viewModel: ChartViewModel;
    onSelectPlanet?: (planet: ChartPlanet) => void;
    onSelectHouse?: (house: ChartHouse) => void;
    className?: string;
}
export declare const AccessibilityTable: React.FC<AccessibilityTableProps>;
