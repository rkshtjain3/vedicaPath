export function evaluatePlanetBav(ashtakavarga, planet, signName, profile) {
    const planetKey = planet.toUpperCase();
    const bavChart = ashtakavarga.bav?.[planetKey];
    if (!bavChart) {
        return {
            planet,
            signName,
            bavPoints: 0,
            bavAverage: 0,
            totalPoints: 0,
            classification: 'AVERAGE',
        };
    }
    // Look up raw bindu points for transit sign
    const bavPoints = bavChart.signPoints?.[signName] ?? 0;
    const totalPoints = bavChart.totalPoints || 0;
    const bavAverage = Math.round((totalPoints / 12) * 100) / 100;
    // Chart-relative classification based on profile thresholds
    let classification = 'AVERAGE';
    if (bavPoints < bavAverage + profile.bavAverageBand.belowOffset) {
        classification = 'BELOW_AVERAGE';
    }
    else if (bavPoints > bavAverage + profile.bavAverageBand.aboveOffset) {
        classification = 'ABOVE_AVERAGE';
    }
    return {
        planet,
        signName,
        bavPoints,
        bavAverage,
        totalPoints,
        classification,
    };
}
//# sourceMappingURL=bav-evaluator.js.map