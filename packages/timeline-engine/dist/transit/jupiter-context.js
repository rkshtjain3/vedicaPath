export function extractJupiterTransitContext(engineData) {
    const timing = engineData.timing || {};
    const transits = timing.transits?.planets || [];
    const jup = transits.find((t) => t.planet?.toLowerCase() === 'jupiter');
    const savMap = engineData.ashtakavarga?.sav || {};
    const house = jup?.houseFromLagna || 1;
    const savPoints = savMap[house] || 28;
    let classification = 'AVERAGE_TRANSIT_CONTEXT';
    if (savPoints >= 30) {
        classification = 'FAVORABLE_TRANSIT_CONTEXT';
    }
    else if (savPoints <= 24) {
        classification = 'CHALLENGING_TRANSIT_CONTEXT';
    }
    return {
        sign: jup?.currentSign?.name || jup?.sign,
        houseFromLagna: house,
        bavPoints: jup?.bavPoints || 4,
        bavAverage: 4,
        savPoints,
        savAverage: 28,
        classification,
    };
}
//# sourceMappingURL=jupiter-context.js.map