import { BirthChart } from '@vedica/astrology-core';
import { ArudhaPada } from '../types/jaimini-types.js';
/**
 * Calculates all 12 Arudha Padas (A1 to A12, including AL and UL) with classical exception rules.
 *
 * Exception Rules (Brihat Parasara Hora Shastra & Jaimini Sutras):
 * 1. If Arudha Pada falls in the house itself (1st from house, offset = 0/12):
 *    Jump 10 houses forward -> places Pada in 10th house from original house.
 * 2. If Arudha Pada falls in the 7th house from the original house (offset = 6):
 *    Jump 10 houses forward from 7th -> places Pada in 4th house from original house.
 */
export declare function calculateArudhaPadas(birthChart: BirthChart): ArudhaPada[];
