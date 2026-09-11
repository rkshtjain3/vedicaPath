import { PERSONAL_QUERY_V1 } from '../profile.js';
import { normalizeQuestion } from './question-normalizer.js';
import { extractEntities } from './entity-extractor.js';
import { classifyIntent } from './intent-classifier.js';
export function parseQuestion(rawQuestion, profile = PERSONAL_QUERY_V1) {
    const normalizedQuestion = normalizeQuestion(rawQuestion);
    const entities = extractEntities(rawQuestion, profile);
    const intent = classifyIntent(entities);
    return {
        rawQuestion,
        normalizedQuestion,
        intent,
    };
}
