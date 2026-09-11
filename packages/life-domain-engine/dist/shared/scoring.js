export function calculateDomainScoring(items) {
    let supportScore = 0;
    let challengeScore = 0;
    let neutralScore = 0;
    let supportCount = 0;
    let challengeCount = 0;
    let neutralCount = 0;
    for (const item of items) {
        const strengthMultiplier = item.strength === 'HIGH' ? 1.5 : item.strength === 'MEDIUM' ? 1.0 : 0.5;
        const value = item.weight * strengthMultiplier;
        if (item.direction === 'SUPPORTIVE') {
            supportScore += value;
            supportCount++;
        }
        else if (item.direction === 'CHALLENGING') {
            challengeScore += value;
            challengeCount++;
        }
        else {
            neutralScore += value;
            neutralCount++;
        }
    }
    // Round scores to 2 decimal places deterministically
    supportScore = Math.round(supportScore * 100) / 100;
    challengeScore = Math.round(challengeScore * 100) / 100;
    neutralScore = Math.round(neutralScore * 100) / 100;
    const totalItems = items.length;
    let state = 'INSUFFICIENT_EVIDENCE';
    let hasMixedSignals = false;
    if (totalItems === 0) {
        state = 'INSUFFICIENT_EVIDENCE';
    }
    else if (supportScore >= 1.2 && challengeScore >= 1.2) {
        state = 'MIXED';
        hasMixedSignals = true;
    }
    else if (Math.abs(supportScore - challengeScore) < 1.2 && supportScore >= 0.8 && challengeScore >= 0.8) {
        state = 'MIXED';
        hasMixedSignals = true;
    }
    else if (supportScore - challengeScore >= 3.5) {
        state = 'STRONGLY_SUPPORTIVE';
    }
    else if (supportScore - challengeScore >= 1.2) {
        state = 'SUPPORTIVE';
    }
    else if (challengeScore - supportScore >= 3.5) {
        state = 'STRONGLY_CHALLENGING';
    }
    else if (challengeScore - supportScore >= 1.2) {
        state = 'CHALLENGING';
    }
    else if (supportCount > 0 && challengeCount > 0) {
        state = 'MIXED';
        hasMixedSignals = true;
    }
    else if (supportScore > challengeScore) {
        state = 'SUPPORTIVE';
    }
    else if (challengeScore > supportScore) {
        state = 'CHALLENGING';
    }
    else {
        state = 'MIXED';
        hasMixedSignals = true;
    }
    return {
        supportScore,
        challengeScore,
        neutralScore,
        state,
        hasMixedSignals,
        supportCount,
        challengeCount,
        neutralCount,
    };
}
//# sourceMappingURL=scoring.js.map