import { QueryProfile } from './profile.js';
import { QueryEngineResponse } from './types.js';
export * from './types.js';
export * from './profile.js';
export * from './question/question-normalizer.js';
export * from './question/question-parser.js';
export * from './retrieval/evidence-retriever.js';
export * from './synthesis/answer-builder.js';
export * from './explainability/why-chain-builder.js';
export * from './reproducibility/query-fingerprint.js';
export interface QueryEngineOptions {
    transitDate?: string;
    fullName?: string;
    calculationReproducibilityHash?: string;
    profile?: QueryProfile;
}
export declare function executeQueryEngine(calculationData: any, question: string, options?: QueryEngineOptions): QueryEngineResponse;
