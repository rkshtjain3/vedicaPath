export function evaluateTransitSignSav(ashtakavarga, signName, profile) {
    const savPoints = ashtakavarga.sav?.signPoints?.[signName] ?? 0;
    const savAverage = Math.round(profile.savAverage * 100) / 100;
    let classification = 'AVERAGE';
    if (savPoints < savAverage + profile.savAverageBand.belowOffset) {
        classification = 'BELOW_AVERAGE';
    }
    else if (savPoints > savAverage + profile.savAverageBand.aboveOffset) {
        classification = 'ABOVE_AVERAGE';
    }
    return {
        signName,
        savPoints,
        savAverage,
        classification,
    };
}
//# sourceMappingURL=sav-evaluator.js.map