import { normalizeQuestion } from './question-normalizer.js';
export function tokenizeQuestion(rawQuestion) {
    const normalized = normalizeQuestion(rawQuestion);
    if (!normalized)
        return [];
    const tokens = normalized.split(' ');
    return tokens.map((token, index) => ({
        token,
        index,
    }));
}
