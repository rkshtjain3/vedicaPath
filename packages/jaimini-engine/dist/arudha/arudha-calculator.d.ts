import { BirthChart } from '@vedica/astrology-core';
import { ArudhaPada } from '../types/jaimini-types.js';
/**
 * Calculates all 12 Arudha Padas (A1 to A12, including AL and UL) with classical exception rules and evidence traces.
 */
export declare function calculateArudhaPadas(birthChart: BirthChart): ArudhaPada[];
