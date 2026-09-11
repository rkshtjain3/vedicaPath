export function partitionEvidenceByConflict(evidenceList) {
    const supportive = [];
    const challenging = [];
    const neutral = [];
    const factual = [];
    for (const item of evidenceList) {
        if (item.classification === 'SUPPORTIVE') {
            supportive.push(item);
        }
        else if (item.classification === 'CHALLENGING') {
            challenging.push(item);
        }
        else if (item.classification === 'FACTUAL') {
            factual.push(item);
        }
        else {
            neutral.push(item);
        }
    }
    const mixedSignals = supportive.length > 0 && challenging.length > 0;
    return {
        supportive,
        challenging,
        neutral,
        factual,
        mixedSignals,
    };
}
