import { BirthChart } from '@vedica/astrology-core';
import { RashiDrishtiItem } from '../types/jaimini-types.js';
export declare const JAIMINI_SIGN_ASPECTS: Record<number, number[]>;
/**
 * Calculates Jaimini Rashi Drishti (sign aspects) and the resulting planetary mutual aspects.
 */
export declare function calculateRashiDrishti(birthChart: BirthChart): RashiDrishtiItem[];
