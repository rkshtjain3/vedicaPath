export function detectConflictPairs(evidenceList) {
    const supportItems = evidenceList.filter((e) => e.direction === 'SUPPORTIVE');
    const challengeItems = evidenceList.filter((e) => e.direction === 'CHALLENGING');
    const pairs = [];
    for (const s of supportItems) {
        for (const c of challengeItems) {
            if (s.planet === c.planet || s.domain === c.domain) {
                pairs.push({ support: s, challenge: c });
            }
        }
    }
    return pairs;
}
//# sourceMappingURL=conflict-detector.js.map