export type EvidenceClassification = 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL' | 'FACTUAL';
export type EvidenceImportance = 'HIGH' | 'MEDIUM' | 'LOW';
export interface ReportEvidence {
    id: string;
    sourceEngine: string;
    sourceType: string;
    sourceId?: string;
    domain?: 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'PROPERTY' | 'GENERAL' | 'STRENGTH' | 'TIMING' | 'YOGAS' | 'NUMEROLOGY';
    classification: EvidenceClassification;
    importance: EvidenceImportance;
    summary: string;
    machineEvidence?: unknown;
}
