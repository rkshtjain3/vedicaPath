export function areConjunct(planetA, planetB, planetFacts, conjunctions) {
    const pA = planetFacts.find((p) => p.planet.toLowerCase() === planetA.toLowerCase());
    const pB = planetFacts.find((p) => p.planet.toLowerCase() === planetB.toLowerCase());
    if (!pA || !pB) {
        return { conjunct: false, details: `One or both planets (${planetA}, ${planetB}) missing from chart.` };
    }
    const sameHouse = pA.house === pB.house;
    const conj = conjunctions.find((c) => (c.planetA.toLowerCase() === planetA.toLowerCase() && c.planetB.toLowerCase() === planetB.toLowerCase()) ||
        (c.planetA.toLowerCase() === planetB.toLowerCase() && c.planetB.toLowerCase() === planetA.toLowerCase()));
    const detected = sameHouse || Boolean(conj?.detected);
    const diffStr = conj ? `${conj.longitudeDifference.toFixed(2)}°` : 'Same House';
    return {
        conjunct: detected,
        details: detected
            ? `${planetA} and ${planetB} are conjunct in House ${pA.house} (diff: ${diffStr}).`
            : `${planetA} (House ${pA.house}) and ${planetB} (House ${pB.house}) are not conjunct.`,
    };
}
