export const PERSONAL_REPORT_V1 = {
    version: 'personal-report-v1',
    language: 'en',
    tone: 'NEUTRAL',
    certaintyPolicy: 'NON_PREDICTIVE',
    evidencePolicy: {
        preserveConflicts: true,
        deduplicateEquivalentEvidence: true,
        preferCrossEngineEvidence: true,
    },
    confidencePolicy: {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
    },
};
