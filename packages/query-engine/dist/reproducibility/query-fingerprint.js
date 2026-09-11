import { createHash } from 'crypto';
export function generateQueryFingerprint(input) {
    const payload = {
        normalizedQuestion: input.normalizedQuestion,
        profileVersion: input.profileVersion,
        transitDate: input.transitDate || '',
        calculationReproducibilityHash: input.calculationReproducibilityHash || '',
    };
    // Only include fullName if explicitly a numerology query (Name Astrology Isolation)
    if (input.isNumerologyExplicit && input.fullName) {
        payload.fullName = input.fullName;
    }
    const jsonString = JSON.stringify(payload);
    return createHash('sha256').update(jsonString).digest('hex');
}
