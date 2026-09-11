/**
 * Calculates the shortest angular distance between two longitudes on a 360° circle.
 * Properly handles 0° / 360° wraparound.
 * Example:
 * 359.98° vs 0.02° => returns 0.04°
 * 0.1° vs 359.9° => returns 0.2°
 */
export function calculateAngularDifference(lon1, lon2) {
    const norm1 = ((lon1 % 360) + 360) % 360;
    const norm2 = ((lon2 % 360) + 360) % 360;
    const diff = Math.abs(norm1 - norm2);
    return Math.min(diff, 360 - diff);
}
export function isWithinAngularTolerance(lon1, lon2, maxTolerance = 0.05) {
    return calculateAngularDifference(lon1, lon2) <= maxTolerance;
}
//# sourceMappingURL=angular-math.js.map