import { QueryAnswer, QueryEvidenceItem, QueryIntent } from '../types.js';
export declare function buildQueryAnswer(question: string, normalizedQuestion: string, intent: QueryIntent, rawEvidence: QueryEvidenceItem[], fullName?: string): QueryAnswer;
