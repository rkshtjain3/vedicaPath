import { SynthesizedPrompt } from './prompt-synthesizer.js';
export interface LLMStreamOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    ollamaEndpoint?: string;
    onToken?: (token: string) => void;
    signal?: AbortSignal;
    engineMode?: 'rag' | 'ollama' | 'auto' | 'groq' | 'openai' | 'gemini' | 'deepseek' | 'openrouter';
    apiKey?: string;
    apiProvider?: 'groq' | 'openai' | 'gemini' | 'deepseek' | 'openrouter';
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
     * Stream response from Cloud LLM (Groq, Gemini, OpenAI, DeepSeek, OpenRouter), local Ollama, or dynamic reasoner
     */
    streamResponse(prompt: SynthesizedPrompt, options?: LLMStreamOptions): AsyncGenerator<string, LLMResponse, unknown>;
    private streamFromCloudLLM;
    private streamFromOllama;
    /**
     * Deterministic High-Fidelity RAG Response Generator
     * Covers all life domains, entities, and arbitrary questions dynamically in English, Hindi, and Hinglish
     */
    private generateSynthesizedRAGResponse;
    /**
     * Universal Question Astrological Deconstructor
     * Dynamically maps ANY question to its authentic Vedic Bhava (1H-12H), Karaka, and domain strategy
     */
    private resolveQuestionAstrology;
    private buildDynamicAstrologicalResponse;
    private generateEnglishRAGResponse;
    private generateHindiRAGResponse;
    private generateHinglishRAGResponse;
}
