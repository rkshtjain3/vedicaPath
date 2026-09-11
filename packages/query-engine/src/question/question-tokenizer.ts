import { normalizeQuestion } from './question-normalizer.js';

export interface TokenInfo {
  token: string;
  index: number;
}

export function tokenizeQuestion(rawQuestion: string): TokenInfo[] {
  const normalized = normalizeQuestion(rawQuestion);
  if (!normalized) return [];

  const tokens = normalized.split(' ');
  return tokens.map((token, index) => ({
    token,
    index,
  }));
}
