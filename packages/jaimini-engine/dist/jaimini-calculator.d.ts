import { BirthChart } from '@vedica/astrology-core';
import { JaiminiReport } from './types/jaimini-types.js';
/**
 * Calculates a complete deterministic Jaimini Astrology report from a BirthChart.
 */
export declare function evaluateJaimini(birthChart: BirthChart, scheme?: '7_KARAKA' | '8_KARAKA'): JaiminiReport;
