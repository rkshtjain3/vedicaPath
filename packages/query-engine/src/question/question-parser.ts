import { QueryIntent } from '../types.js';
import { PERSONAL_QUERY_V1, QueryProfile } from '../profile.js';
import { normalizeQuestion } from './question-normalizer.js';
import { extractEntities } from './entity-extractor.js';
import { classifyIntent } from './intent-classifier.js';

export interface ParsedQuestion {
  rawQuestion: string;
  normalizedQuestion: string;
  intent: QueryIntent;
}

export function parseQuestion(
  rawQuestion: string,
  profile: QueryProfile = PERSONAL_QUERY_V1
): ParsedQuestion {
  const normalizedQuestion = normalizeQuestion(rawQuestion);
  const entities = extractEntities(rawQuestion, profile);
  const intent = classifyIntent(entities);

  return {
    rawQuestion,
    normalizedQuestion,
    intent,
  };
}
