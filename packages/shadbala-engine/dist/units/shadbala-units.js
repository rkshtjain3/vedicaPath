export const VIRUPAS_PER_RUPA = 60;
/**
 * Converts Virupas to Rupas with floating-point precision (no rounding).
 * 60 Virupas = 1 Rupa
 */
export function virupasToRupas(virupas) {
    return virupas / VIRUPAS_PER_RUPA;
}
/**
 * Converts Rupas to Virupas with floating-point precision (no rounding).
 */
export function rupasToVirupas(rupas) {
    return rupas * VIRUPAS_PER_RUPA;
}
/**
 * Normalizes an angle into the range [0, 360).
 */
export function normalizeAngle360(angle) {
    const mod = angle % 360;
    return mod < 0 ? mod + 360 : mod;
}
/**
 * Computes shortest angular distance between two longitudes in degrees [0, 180].
 */
export function angularDistance180(lon1, lon2) {
    const norm1 = normalizeAngle360(lon1);
    const norm2 = normalizeAngle360(lon2);
    const diff = Math.abs(norm1 - norm2);
    return diff > 180 ? 360 - diff : diff;
}
