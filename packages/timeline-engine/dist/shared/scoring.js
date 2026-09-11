export function calculateTimingScoring(evidenceList) {
    let supportScore = 0;
    let challengeScore = 0;
    let neutralScore = 0;
    let supportCount = 0;
    let challengeCount = 0;
    let neutralCount = 0;
    for (const item of evidenceList) {
        if (item.direction === 'SUPPORTIVE') {
            supportScore += item.weight;
            supportCount++;
        }
        else if (item.direction === 'CHALLENGING') {
            challengeScore += item.weight;
            challengeCount++;
        }
        else {
            neutralScore += item.weight;
            neutralCount++;
        }
    }
    return {
        supportScore: Number(supportScore.toFixed(2)),
        challengeScore: Number(challengeScore.toFixed(2)),
        neutralScore: Number(neutralScore.toFixed(2)),
        supportCount,
        challengeCount,
        neutralCount,
        totalEvidence: evidenceList.length,
    };
}
//# sourceMappingURL=scoring.js.map