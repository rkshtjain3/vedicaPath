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

export const PERSONAL_REPORT_V1: PersonalReportProfile = {
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
