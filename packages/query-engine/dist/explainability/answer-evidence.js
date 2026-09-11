import { buildWhyChain } from './why-chain-builder.js';
export function getAnswerWhyChains(answer) {
    const allItems = [
        ...answer.supportiveEvidence,
        ...answer.challengingEvidence,
        ...answer.neutralEvidence,
    ];
    return allItems.map((item) => buildWhyChain(item));
}
