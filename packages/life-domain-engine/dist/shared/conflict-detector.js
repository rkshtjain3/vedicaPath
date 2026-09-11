export function detectEvidenceConflicts(supporting, challenging) {
    if (supporting.length === 0 || challenging.length === 0) {
        return {
            present: false,
            description: 'No evidence conflict detected for this domain.',
            conflictingPairs: [],
        };
    }
    const conflictingPairs = [];
    // Match high/medium supportive items with challenging items
    const maxPairs = Math.min(supporting.length, challenging.length, 5);
    for (let i = 0; i < maxPairs; i++) {
        conflictingPairs.push({
            support: supporting[i],
            challenge: challenging[i],
        });
    }
    const description = `Domain exhibits mixed signals with ${supporting.length} supportive factor(s) and ${challenging.length} challenging factor(s). Both perspectives are preserved to maintain full astrological fidelity.`;
    return {
        present: true,
        description,
        conflictingPairs,
    };
}
//# sourceMappingURL=conflict-detector.js.map