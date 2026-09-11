export interface AnalysisProfile {
    version: string;
    name: string;
    conjunctionOrbDegrees: number;
    aspectMethodology: 'VEDIC_SIGN_HOUSE';
    includeNodeAspects: boolean;
    combustionThresholds: Record<string, {
        direct: number;
        retrograde: number;
    }>;
    yogaDefinitionSet: 'STANDARD_CLASSICAL';
}
export declare const PERSONAL_ANALYSIS_V1: AnalysisProfile;
