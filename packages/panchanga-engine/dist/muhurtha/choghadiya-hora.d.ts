import { TimeInterval } from '../types/panchanga-types.js';
export interface HoraPeriod {
    index: number;
    lord: string;
    isDaytime: boolean;
    interval: TimeInterval;
    nature: 'Auspicious' | 'Neutral' | 'Inauspicious';
}
export interface ChoghadiyaPeriod {
    index: number;
    name: 'Amrit' | 'Shubh' | 'Labh' | 'Chara' | 'Rog' | 'Kaal' | 'Udveg';
    isDaytime: boolean;
    nature: 'Auspicious' | 'Neutral' | 'Inauspicious';
    interval: TimeInterval;
}
export interface ChoghadiyaHoraResult {
    horas: HoraPeriod[];
    choghadiyas: ChoghadiyaPeriod[];
}
export declare function calculateChoghadiyaHora(dayIndex: number, // 0=Sunday
sunriseMinutes?: number, sunsetMinutes?: number): ChoghadiyaHoraResult;
