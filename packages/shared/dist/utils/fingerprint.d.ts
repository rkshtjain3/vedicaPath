export interface CalculationInputAudit {
    birthLocalDate: string;
    birthLocalTime: string;
    location: {
        displayName: string;
        latitude: number;
        longitude: number;
        timezone: string;
    };
    resolvedUTC: string;
    calculationProfile: string;
}
/**
  Generates a deterministic hex SHA-256 fingerprint for a calculation input record.
 */
export declare function calculateInputFingerprint(input: CalculationInputAudit): string;
/**
 * Generates a reproducible calculation hash combining input fingerprint and core output values.
 * Excludes variable runtime metadata (timestamps, cache IDs, random IDs).
 */
export declare function calculateReproducibilityHash(inputFingerprint: string, ascendantLongitude: number, planetLongitudes: Record<string, number>): string;
//# sourceMappingURL=fingerprint.d.ts.map