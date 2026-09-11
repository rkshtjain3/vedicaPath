export type LifeDomainTopic = 'ABROAD' | 'CAREER' | 'WEALTH' | 'MARRIAGE' | 'PROPERTY' | 'HEALTH' | 'EDUCATION' | 'CHILDREN' | 'STRUGGLE' | 'DHARMA' | 'DECISION_SIMULATION' | 'AYUR_JYOTISH' | 'GENERAL';
export type SupportedAILanguage = 'en' | 'hi' | 'hinglish' | 'auto';
export declare function detectNaturalLanguage(text: string): 'en' | 'hi' | 'hinglish';
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface ConfidenceRating {
    probabilityPercentage: number;
    verdictLabel: string;
    primaryCatalyst: string;
    coreTriggerWindow: string;
}
export interface AstrologicalRAGContext {
    fullName?: string;
    language: 'en' | 'hi' | 'hinglish';
    lagnaSign: string;
    lagnaModality: 'Movable' | 'Dual' | 'Fixed';
    lagnaDegreeFormatted?: string;
    moonSign: string;
    birthNakshatra: string;
    sunSign: string;
    activeMahadasha: string;
    activeAntardasha: string;
    antardashaEndDate: string;
    sadeSatiStatus: string;
    primaryArchetype: string;
    coreLifeAim: string;
    careerLeapWindow?: string;
    propertyPurchaseWindow?: string;
    marriageTimingWindow?: string;
    relocationWindow?: string;
    wealthWindow?: string;
    struggleRootCause?: string;
    struggleReliefDate?: string;
    sattvicRemedies: string[];
    detectedTopic: LifeDomainTopic;
    detectedSubIntent?: string;
    questionQuery?: string;
    intentConfidence: 'HIGH' | 'MEDIUM' | 'GENERAL';
    jaiminiKarakas: {
        atmakaraka?: string;
        amatyakaraka?: string;
        darakaraka?: string;
    };
    keyHouseSummary: string;
    astrologicalSignatures: {
        foreignTravelSignatures: string[];
        careerSignatures: string[];
        wealthSignatures: string[];
        marriageSignatures: string[];
        healthSignatures: string[];
    };
    followUpSuggestions: Array<{
        en: string;
        hi: string;
        query: string;
    }>;
    planetsDetail: Array<{
        planet: string;
        sign: string;
        house: number;
        nakshatra: string;
        pada?: number;
        degreeFormatted?: string;
        isRetrograde?: boolean;
        dignity?: string;
    }>;
    houseDetails: Array<{
        houseNumber: number;
        signName: string;
        lord: string;
        occupants: string[];
        savPoints: number;
    }>;
    savScores: Record<number, number>;
    topShadbalaPlanets: Array<{
        planet: string;
        rupas: number;
        percentage: number;
    }>;
    verifiedYogas: Array<{
        name: string;
        category?: string;
        description?: string;
    }>;
    divisionalHighlights: {
        d9Lagna?: string;
        d9MoonSign?: string;
        d10Lagna?: string;
        d10TenthLord?: string;
    };
    doshaProfile?: any;
    confidenceRating: ConfidenceRating;
    classicalSutraCitation: string;
}
export interface SynthesizedPrompt {
    systemPrompt: string;
    userPrompt: string;
    context: AstrologicalRAGContext;
    followUpSuggestions: Array<{
        en: string;
        hi: string;
        query: string;
    }>;
}
/**
 * Intelligent Multi-Intent Life Domain Classifier
 */
export declare function classifyLifeDomain(question: string): {
    topic: LifeDomainTopic;
    confidence: 'HIGH' | 'MEDIUM' | 'GENERAL';
};
/**
 * Intelligent Sub-Intent Classifier for Nuanced Domain Understanding
 */
export declare function detectSubIntent(question: string, topic: LifeDomainTopic): string;
/**
 * Generate Smart Contextual Follow-up Questions based on detected topic & chart
 */
export declare function generateFollowUpSuggestions(topic: LifeDomainTopic, context: Partial<AstrologicalRAGContext>): Array<{
    en: string;
    hi: string;
    query: string;
}>;
export declare function synthesizeAstrologicalPrompt(params: {
    question: string;
    calculationData: any;
    fullName?: string;
    language?: SupportedAILanguage;
    conversationHistory?: ChatMessage[];
}): SynthesizedPrompt;
