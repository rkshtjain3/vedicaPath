/**
 * Multi-Turn AI Chart Context Memory
 * Maintains persistent chart state and conversation history across turns
 */
const memoryStore = new Map();
export function getOrCreateSession(sessionId, chartContext) {
    const existing = memoryStore.get(sessionId);
    if (existing) {
        // Update chart context if provided
        existing.chartContext = { ...existing.chartContext, ...chartContext };
        existing.updatedAt = new Date().toISOString();
        return existing;
    }
    const newSession = {
        sessionId,
        chartContext,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    memoryStore.set(sessionId, newSession);
    return newSession;
}
export function addTurnToSession(sessionId, turn) {
    const session = memoryStore.get(sessionId);
    if (!session)
        return undefined;
    const fullTurn = {
        ...turn,
        id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
    };
    session.history.push(fullTurn);
    session.updatedAt = new Date().toISOString();
    return session;
}
export function buildContextualPromptPrefix(session, maxHistoryTurns = 4) {
    const ctx = session.chartContext;
    let prefix = `[CHART CONTEXT: User=${ctx.fullName}, Lagna=${ctx.lagnaSign || 'N/A'}, Moon=${ctx.moonSign || 'N/A'} (${ctx.moonNakshatra || 'N/A'}), Current Dasha=${ctx.currentMahaDasha || 'N/A'}/${ctx.currentAntarDasha || 'N/A'}]\n`;
    if (session.history.length > 0) {
        const recentHistory = session.history.slice(-maxHistoryTurns);
        prefix += `[CONVERSATION HISTORY]\n`;
        for (const h of recentHistory) {
            prefix += `${h.role.toUpperCase()}: ${h.content}\n`;
        }
    }
    return prefix;
}
export function clearSession(sessionId) {
    return memoryStore.delete(sessionId);
}
