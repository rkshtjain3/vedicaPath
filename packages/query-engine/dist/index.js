import { PERSONAL_QUERY_V1 } from './profile.js';
import { parseQuestion } from './question/question-parser.js';
import { retrieveEvidenceForIntent } from './retrieval/evidence-retriever.js';
import { buildQueryAnswer } from './synthesis/answer-builder.js';
import { generateQueryFingerprint } from './reproducibility/query-fingerprint.js';
export * from './types.js';
export * from './profile.js';
export * from './question/question-normalizer.js';
export * from './question/question-parser.js';
export * from './retrieval/evidence-retriever.js';
export * from './synthesis/answer-builder.js';
export * from './explainability/why-chain-builder.js';
export * from './reproducibility/query-fingerprint.js';
export function executeQueryEngine(calculationData, question, options = {}) {
    const profile = options.profile || PERSONAL_QUERY_V1;
    // 1. Question Normalization & Intent Parsing
    const parsed = parseQuestion(question, profile);
    // 2. Evidence Retrieval
    const rawEvidence = retrieveEvidenceForIntent(calculationData, parsed.intent, options.fullName);
    // 3. Synthesis & Answer Assembly
    const queryAnswer = buildQueryAnswer(question, parsed.normalizedQuestion, parsed.intent, rawEvidence, options.fullName);
    // 4. Reproducibility & Fingerprinting (Name Isolation guaranteed unless explicit numerology intent)
    const isNumerologyExplicit = parsed.intent.category === 'NUMEROLOGY';
    const queryFingerprint = generateQueryFingerprint({
        normalizedQuestion: parsed.normalizedQuestion,
        profileVersion: profile.version,
        transitDate: options.transitDate,
        calculationReproducibilityHash: options.calculationReproducibilityHash,
        isNumerologyExplicit,
        fullName: options.fullName,
    });
    return {
        query: queryAnswer,
        audit: {
            profileVersion: profile.version,
            queryFingerprint,
            calculationReproducibilityHash: options.calculationReproducibilityHash,
        },
    };
}
