export const SPECIAL_ASPECTS = {
    Sun: [7],
    Moon: [7],
    Mars: [4, 7, 8],
    Mercury: [7],
    Jupiter: [5, 7, 9],
    Venus: [7],
    Saturn: [3, 7, 10],
};
export function calculateTargetHouse(fromHouse, aspectNumber) {
    const target = (fromHouse + aspectNumber - 1) % 12;
    return target === 0 ? 12 : target;
}
export function calculateVedicAspects(planetFacts, includeNodeAspects = false) {
    const aspects = [];
    for (const p of planetFacts) {
        let aspectNumbers = [];
        if (p.planet === 'Rahu' || p.planet === 'Ketu') {
            if (!includeNodeAspects)
                continue;
            aspectNumbers = [5, 7, 9];
        }
        else {
            aspectNumbers = SPECIAL_ASPECTS[p.planet] || [7];
        }
        for (const aspectNum of aspectNumbers) {
            const targetHouse = calculateTargetHouse(p.house, aspectNum);
            const targetPlanets = planetFacts
                .filter((other) => other.house === targetHouse && other.planet !== p.planet)
                .map((other) => other.planet);
            aspects.push({
                fromPlanet: p.planet,
                fromHouse: p.house,
                aspectNumber: aspectNum,
                toHouse: targetHouse,
                targetPlanets,
            });
        }
    }
    return aspects;
}
