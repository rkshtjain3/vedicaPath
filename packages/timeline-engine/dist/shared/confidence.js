export function calculateConfidence(evidenceList, availableEngines) {
    const engineSet = new Set(evidenceList.map((e) => e.sourceEngine));
    const independentEngineCount = engineSet.size;
    const totalPossible = Math.max(1, availableEngines.length);
    const completenessRatio = Number((independentEngineCount / totalPossible).toFixed(2));
    let score = independentEngineCount * 25 + evidenceList.length * 5;
    score = Math.min(100, Math.max(10, score));
    let level = 'LOW';
    if (score >= 70 && independentEngineCount >= 3) {
        level = 'HIGH';
    }
    else if (score >= 40 && independentEngineCount >= 2) {
        level = 'MEDIUM';
    }
    return {
        level,
        score,
        independentEngineCount,
        completenessRatio,
        benchmarkedStatus: true,
        metadataExplanation: `Confidence rating ${level} derived from ${independentEngineCount} independent source engines across ${evidenceList.length} total evidence points. Does not represent certainty of future events.`,
    };
}
//# sourceMappingURL=confidence.js.map