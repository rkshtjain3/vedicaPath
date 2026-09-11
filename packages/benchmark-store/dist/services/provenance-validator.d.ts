import { ReferenceProvenance, VerificationStatus } from '../types/benchmark-types.js';
export interface ProvenanceValidationResult {
    valid: boolean;
    errors: string[];
    effectiveStatus: VerificationStatus;
}
export declare function validateReferenceProvenance(provenance: ReferenceProvenance | undefined | null): ProvenanceValidationResult;
export declare function detectSelfReferencing(referenceValues: Record<string, any> | undefined | null, actualChartOutputs: Record<string, any> | undefined | null, provenance?: ReferenceProvenance | null): {
    isSelfReferenced: boolean;
    reason?: string;
};
//# sourceMappingURL=provenance-validator.d.ts.map