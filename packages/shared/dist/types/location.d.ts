/**
 * Location model for astrology & numerology calculations.
 * Always preserves latitude, longitude, and IANA timezone identifier.
 */
export interface LocationInput {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
}
/**
 * Interface for location resolution service (geocoding/lookup).
 * Separates location searching from chart calculation.
 */
export interface LocationResolver {
    resolveLocation(query: string): Promise<LocationInput>;
}
/**
 * Basic static location resolver implementation for Phase 1.
 */
export declare class StaticLocationResolver implements LocationResolver {
    private static readonly PRESETS;
    resolveLocation(query: string): Promise<LocationInput>;
}
//# sourceMappingURL=location.d.ts.map