import { ReportEvidence, EvidenceClassification, EvidenceImportance } from '../types/evidence-types.js';
export declare function createEvidenceItem(id: string, sourceEngine: string, sourceType: string, summary: string, classification: EvidenceClassification, importance: EvidenceImportance, domain?: ReportEvidence['domain'], sourceId?: string, machineEvidence?: unknown): ReportEvidence;
export declare function normalizeRulesEvidence(rulesResult: any): ReportEvidence[];
export declare function normalizeTimingEvidence(timingResult: any): ReportEvidence[];
export declare function normalizeStrengthEvidence(strengthResult: any, shadbalaResult: any): ReportEvidence[];
export declare function normalizeYogaEvidence(yogaResult: any): ReportEvidence[];
