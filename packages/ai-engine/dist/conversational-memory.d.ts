/**
 * Multi-Turn AI Chart Context Memory
 * Maintains persistent chart state and conversation history across turns
 */
export interface ChartContext {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    locationName: string;
    lagnaSign?: string;
    moonSign?: string;
    moonNakshatra?: string;
    currentMahaDasha?: string;
    currentAntarDasha?: string;
    keyYogas?: string[];
}
export interface ConversationTurn {
    id: string;
    timestamp: string;
    role: 'user' | 'assistant';
    content: string;
    intentCategory?: string;
}
export interface SessionState {
    sessionId: string;
    chartContext: ChartContext;
    history: ConversationTurn[];
    createdAt: string;
    updatedAt: string;
}
export declare function getOrCreateSession(sessionId: string, chartContext: ChartContext): SessionState;
export declare function addTurnToSession(sessionId: string, turn: Omit<ConversationTurn, 'id' | 'timestamp'>): SessionState | undefined;
export declare function buildContextualPromptPrefix(session: SessionState, maxHistoryTurns?: number): string;
export declare function clearSession(sessionId: string): boolean;
