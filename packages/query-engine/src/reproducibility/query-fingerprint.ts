import { createHash } from 'crypto';

export interface FingerprintInput {
  normalizedQuestion: string;
  profileVersion: string;
  transitDate?: string;
  calculationReproducibilityHash?: string;
  isNumerologyExplicit?: boolean;
  fullName?: string;
}

export function generateQueryFingerprint(input: FingerprintInput): string {
  const payload: Record<string, any> = {
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
