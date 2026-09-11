import { QueryAnswer, QueryEvidenceItem } from '../types.js';
import { buildWhyChain, WhyChain } from './why-chain-builder.js';

export function getAnswerWhyChains(answer: QueryAnswer): WhyChain[] {
  const allItems: QueryEvidenceItem[] = [
    ...answer.supportiveEvidence,
    ...answer.challengingEvidence,
    ...answer.neutralEvidence,
  ];

  return allItems.map((item) => buildWhyChain(item));
}
