import { createHash } from 'crypto';
/**
  Generates a deterministic hex SHA-256 fingerprint for a calculation input record.
 */
export function calculateInputFingerprint(input) {
    const canonicalPayload = [
        input.birthLocalDate,
        input.birthLocalTime,
        input.location.latitude.toFixed(6),
        input.location.longitude.toFixed(6),
        input.location.timezone,
        input.resolvedUTC,
        input.calculationProfile,
    ].join('|');
    try {
        return createHash('sha256').update(canonicalPayload).digest('hex');
    }
    catch {
        // Simple fallback hash if crypto unavailable
        let hash = 0;
        for (let i = 0; i < canonicalPayload.length; i++) {
            const char = canonicalPayload.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return `fp-${Math.abs(hash).toString(16)}`;
    }
}
/**
 * Generates a reproducible calculation hash combining input fingerprint and core output values.
 * Excludes variable runtime metadata (timestamps, cache IDs, random IDs).
 */
export function calculateReproducibilityHash(inputFingerprint, ascendantLongitude, planetLongitudes) {
    const sortedPlanets = Object.keys(planetLongitudes)
        .sort()
        .map((k) => `${k}:${planetLongitudes[k].toFixed(4)}`)
        .join(';');
    const payload = `${inputFingerprint}|ASC:${ascendantLongitude.toFixed(4)}|${sortedPlanets}`;
    try {
        return createHash('sha256').update(payload).digest('hex');
    }
    catch {
        let hash = 0;
        for (let i = 0; i < payload.length; i++) {
            const char = payload.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return `repr-${Math.abs(hash).toString(16)}`;
    }
}
//# sourceMappingURL=fingerprint.js.map