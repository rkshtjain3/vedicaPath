export function detectMixedSignals(factors) {
    let supportiveCount = 0;
    let challengingCount = 0;
    let neutralCount = 0;
    for (const f of factors) {
        if (f.classification === 'SUPPORTIVE')
            supportiveCount++;
        else if (f.classification === 'CHALLENGING')
            challengingCount++;
        else
            neutralCount++;
    }
    const mixedSignals = supportiveCount > 0 && challengingCount > 0;
    return {
        mixedSignals,
        supportiveCount,
        challengingCount,
        neutralCount,
        totalFactors: factors.length,
    };
}
//# sourceMappingURL=conflict-detector.js.map