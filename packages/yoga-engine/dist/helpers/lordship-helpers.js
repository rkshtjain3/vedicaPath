export function getLordOfHouse(houseNumber, houseLordFacts) {
    return houseLordFacts.find((h) => h.house === houseNumber)?.lord;
}
export function getHouseLordFact(houseNumber, houseLordFacts) {
    return houseLordFacts.find((h) => h.house === houseNumber);
}
export function getPlanetFact(planet, planetFacts) {
    return planetFacts.find((p) => p.planet.toLowerCase() === planet.toLowerCase());
}
export function isParivartana(houseA, houseB, houseLordFacts) {
    const factA = houseLordFacts.find((h) => h.house === houseA);
    const factB = houseLordFacts.find((h) => h.house === houseB);
    if (!factA || !factB)
        return false;
    return factA.lordHouse === houseB && factB.lordHouse === houseA;
}
