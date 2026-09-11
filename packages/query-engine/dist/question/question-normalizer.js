/**
 * Deterministic Question Normalizer
 * Converts input string to lowercase, strips punctuation, normalizes whitespace,
 * while preserving meaningful terms.
 */
export function normalizeQuestion(rawQuestion) {
    if (!rawQuestion)
        return '';
    return rawQuestion
        .trim()
        .toLowerCase()
        // Replace punctuation with spaces except hyphens inside words
        .replace(/[^\w\s-]/g, ' ')
        // Normalize multiple spaces
        .replace(/\s+/g, ' ')
        .trim();
}
