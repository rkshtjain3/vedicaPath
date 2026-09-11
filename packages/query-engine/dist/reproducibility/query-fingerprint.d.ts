export interface FingerprintInput {
    normalizedQuestion: string;
    profileVersion: string;
    transitDate?: string;
    calculationReproducibilityHash?: string;
    isNumerologyExplicit?: boolean;
    fullName?: string;
}
export declare function generateQueryFingerprint(input: FingerprintInput): string;
