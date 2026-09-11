/**
 * Calculates the shortest angular distance between two longitudes on a 360° circle.
 * Properly handles 0° / 360° wraparound.
 * Example:
 * 359.98° vs 0.02° => returns 0.04°
 * 0.1° vs 359.9° => returns 0.2°
 */
export declare function calculateAngularDifference(lon1: number, lon2: number): number;
export declare function isWithinAngularTolerance(lon1: number, lon2: number, maxTolerance?: number): boolean;
//# sourceMappingURL=angular-math.d.ts.map