import { PlanetName } from '@vedica/astrology-core';
export interface ExaltationDebilitationPoint {
    planet: PlanetName;
    exaltationSign: string;
    exaltationDegree: number;
    exaltationLongitude: number;
    debilitationSign: string;
    debilitationDegree: number;
    debilitationLongitude: number;
}
/**
 * Classical Planetary Exaltation and Debilitation Deepest Longitudes (Paramochcha & Paramaneecha)
 * Source: Brihat Parasara Hora Shastra (BPHS) & Surya Siddhanta.
 */
export declare const EXALTATION_DEBILITATION_POINTS: Record<PlanetName, ExaltationDebilitationPoint>;
