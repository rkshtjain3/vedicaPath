import { BirthChart } from '@vedica/astrology-core';
import { CharaKarakaInfo, KarakamshaAnalysis } from '../types/jaimini-types.js';
/**
 * Calculates 7-Karaka or 8-Karaka Jaimini Chara Karakas.
 */
export declare function calculateCharaKarakas(birthChart: BirthChart, scheme?: '7_KARAKA' | '8_KARAKA'): CharaKarakaInfo[];
/**
 * Analyzes the Karakamsha (the D9 Navamsa sign occupied by the Atmakaraka).
 */
export declare function analyzeKarakamsha(birthChart: BirthChart, charaKarakas: CharaKarakaInfo[]): KarakamshaAnalysis;
