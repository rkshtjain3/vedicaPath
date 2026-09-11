export function planetAspectsHouse(planet, targetHouse, aspects) {
    return aspects.some((a) => a.fromPlanet.toLowerCase() === planet.toLowerCase() && a.toHouse === targetHouse);
}
export function planetAspectsPlanet(fromPlanet, toPlanet, planetFacts, aspects) {
    const targetFact = planetFacts.find((p) => p.planet.toLowerCase() === toPlanet.toLowerCase());
    if (!targetFact)
        return false;
    return planetAspectsHouse(fromPlanet, targetFact.house, aspects);
}
export function areMutualAspecting(planetA, planetB, planetFacts, aspects) {
    const aAspectsB = planetAspectsPlanet(planetA, planetB, planetFacts, aspects);
    const bAspectsA = planetAspectsPlanet(planetB, planetA, planetFacts, aspects);
    return aAspectsB && bAspectsA;
}
