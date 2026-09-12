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

const memoryStore = new Map<string, SessionState>();

export function getOrCreateSession(sessionId: string, chartContext: ChartContext): SessionState {
  const existing = memoryStore.get(sessionId);
  if (existing) {
    // Update chart context if provided
    existing.chartContext = { ...existing.chartContext, ...chartContext };
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const newSession: SessionState = {
    sessionId,
    chartContext,
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.set(sessionId, newSession);
  return newSession;
}

export function addTurnToSession(
  sessionId: string,
  turn: Omit<ConversationTurn, 'id' | 'timestamp'>
): SessionState | undefined {
  const session = memoryStore.get(sessionId);
  if (!session) return undefined;

  const fullTurn: ConversationTurn = {
    ...turn,
    id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  session.history.push(fullTurn);
  session.updatedAt = new Date().toISOString();
  return session;
}

export function buildContextualPromptPrefix(session: SessionState, maxHistoryTurns = 4): string {
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

export function clearSession(sessionId: string): boolean {
  return memoryStore.delete(sessionId);
}
