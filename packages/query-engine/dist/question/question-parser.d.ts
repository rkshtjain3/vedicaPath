import { QueryIntent } from '../types.js';
import { QueryProfile } from '../profile.js';
export interface ParsedQuestion {
    rawQuestion: string;
    normalizedQuestion: string;
    intent: QueryIntent;
}
export declare function parseQuestion(rawQuestion: string, profile?: QueryProfile): ParsedQuestion;
