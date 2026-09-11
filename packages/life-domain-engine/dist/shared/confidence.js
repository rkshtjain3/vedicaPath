export function calculateConfidence(evidenceItems, availableEngines) {
    const uniqueEngines = new Set(evidenceItems.map((item) => item.sourceEngine));
    const engineDiversityCount = uniqueEngines.size;
    const evidenceSourceCount = evidenceItems.length;
    const dataCompletenessScore = Math.min(1.0, (availableEngines.length / 8.0) * 0.5 + (evidenceSourceCount / 10.0) * 0.5);
    let level = 'LOW';
    if (engineDiversityCount >= 4 && evidenceSourceCount >= 5) {
        level = 'HIGH';
    }
    else if (engineDiversityCount >= 2 && evidenceSourceCount >= 3) {
        level = 'MEDIUM';
    }
    else {
        level = 'LOW';
    }
    const disclaimer = 'Confidence level reflects data completeness and multi-engine convergence. It does not represent predictive certainty or guaranteed real-world outcomes.';
    return {
        level,
        evidenceSourceCount,
        engineDiversityCount,
        dataCompletenessScore: Math.round(dataCompletenessScore * 100) / 100,
        disclaimer,
    };
}
//# sourceMappingURL=confidence.js.map