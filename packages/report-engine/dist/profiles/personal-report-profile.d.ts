export interface PersonalReportProfile {
    version: string;
    language: string;
    tone: 'NEUTRAL';
    certaintyPolicy: 'NON_PREDICTIVE';
    evidencePolicy: {
        preserveConflicts: boolean;
        deduplicateEquivalentEvidence: boolean;
        preferCrossEngineEvidence: boolean;
    };
    confidencePolicy: {
        LOW: number;
        MEDIUM: number;
        HIGH: number;
    };
}
export declare const PERSONAL_REPORT_V1: PersonalReportProfile;
