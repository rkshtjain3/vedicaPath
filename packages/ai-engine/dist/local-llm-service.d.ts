import { SynthesizedPrompt } from './prompt-synthesizer.js';
export interface LLMStreamOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    ollamaEndpoint?: string;
    onToken?: (token: string) => void;
    signal?: AbortSignal;
    engineMode?: 'rag' | 'ollama' | 'auto';
}
export interface LLMResponse {
    content: string;
    modelUsed: string;
    isFallback: boolean;
}
export declare class LocalLLMService {
    private defaultModel;
    private defaultEndpoint;
    constructor(options?: {
        model?: string;
        endpoint?: string;
    });
    /**
     * Check if local Ollama daemon is reachable
     */
    isOllamaAvailable(): Promise<boolean>;
    /**
     * Stream response from local LLM or high-fidelity deterministic synthesizer
     */
    streamResponse(prompt: SynthesizedPrompt, options?: LLMStreamOptions): AsyncGenerator<string, LLMResponse, unknown>;
    private streamFromOllama;
    /**
     * Deterministic High-Fidelity RAG Response Generator
     * Covers all life domains in English, Hindi, and Hinglish with concise, scannable format
     */
    private generateSynthesizedRAGResponse;
    private generateEnglishRAGResponse;
    private generateHindiRAGResponse;
    private generateHinglishRAGResponse;
}
