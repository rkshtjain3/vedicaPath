export function isPlanetConnectedToHouse(planet, house, analysis) {
    const evidence = [];
    const targetHouseFact = analysis.houseFacts.find((h) => h.house === house);
    if (!targetHouseFact) {
        return { connected: false, evidence: [] };
    }
    const houseLord = targetHouseFact.lord;
    // 1. Occupies house
    if (targetHouseFact.planets.includes(planet)) {
        evidence.push({
            type: 'PLANET_OCCUPIES_HOUSE',
            planet,
            house,
            details: `${planet} occupies House ${house}`,
        });
    }
    // 2. Rules house
    if (houseLord === planet) {
        evidence.push({
            type: 'PLANET_RULES_HOUSE',
            planet,
            house,
            details: `${planet} is the ruler/lord of House ${house}`,
        });
    }
    // 3. Aspects house
    const houseAspects = analysis.aspects.filter((asp) => asp.fromPlanet === planet && asp.toHouse === house);
    for (const asp of houseAspects) {
        evidence.push({
            type: 'PLANET_ASPECTS_HOUSE',
            planet,
            house,
            aspectNumber: asp.aspectNumber,
            details: `${planet} casts its ${asp.aspectNumber}th house aspect onto House ${house}`,
        });
    }
    // 4. Aspects house lord
    const lordAspects = analysis.aspects.filter((asp) => asp.fromPlanet === planet && asp.targetPlanets.includes(houseLord));
    for (const asp of lordAspects) {
        evidence.push({
            type: 'PLANET_ASPECTS_HOUSE_LORD',
            planet,
            house,
            lord: houseLord,
            aspectNumber: asp.aspectNumber,
            details: `${planet} casts its ${asp.aspectNumber}th aspect onto House ${house} lord (${houseLord})`,
        });
    }
    // 5. Conjuncts house lord
    const lordConjunctions = analysis.conjunctions.filter((conj) => conj.detected &&
        ((conj.planetA === planet && conj.planetB === houseLord) ||
            (conj.planetB === planet && conj.planetA === houseLord)));
    for (const conj of lordConjunctions) {
        evidence.push({
            type: 'PLANET_CONJUNCT_HOUSE_LORD',
            planet,
            house,
            lord: houseLord,
            longitudeDifference: conj.longitudeDifference,
            details: `${planet} is conjunct House ${house} lord (${houseLord}) with ${conj.longitudeDifference.toFixed(2)}° diff`,
        });
    }
    return {
        connected: evidence.length > 0,
        evidence,
    };
}
//# sourceMappingURL=connection-resolver.js.map