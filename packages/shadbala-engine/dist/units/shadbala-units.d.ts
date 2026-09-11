export declare const VIRUPAS_PER_RUPA = 60;
/**
 * Converts Virupas to Rupas with floating-point precision (no rounding).
 * 60 Virupas = 1 Rupa
 */
export declare function virupasToRupas(virupas: number): number;
/**
 * Converts Rupas to Virupas with floating-point precision (no rounding).
 */
export declare function rupasToVirupas(rupas: number): number;
/**
 * Normalizes an angle into the range [0, 360).
 */
export declare function normalizeAngle360(angle: number): number;
/**
 * Computes shortest angular distance between two longitudes in degrees [0, 180].
 */
export declare function angularDistance180(lon1: number, lon2: number): number;
