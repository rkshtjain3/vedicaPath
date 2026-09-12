import { BirthChart } from '@vedica/astrology-core';
import { RashiDrishtiItem } from '../types/jaimini-types.js';
export declare const JAIMINI_SIGN_ASPECTS: Record<number, number[]>;
/**
 * Calculates Jaimini Rashi Drishti (sign aspects) with structured evidence traces.
 */
export declare function calculateRashiDrishti(birthChart: BirthChart): RashiDrishtiItem[];
