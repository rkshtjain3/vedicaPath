import { BirthChart } from '@vedica/astrology-core';
import { ArudhaPada, CharaKarakaInfo, JaiminiYoga, KarakamshaAnalysis, RashiDrishtiItem } from '../types/jaimini-types.js';
export declare function evaluateJaiminiYogas(chart: BirthChart, charaKarakas: CharaKarakaInfo[], karakamsha: KarakamshaAnalysis, arudhaPadas: ArudhaPada[], rashiDrishti: RashiDrishtiItem[]): JaiminiYoga[];
