export function calculateAngularDistance(lonA, lonB) {
    const diff = Math.abs(lonA - lonB);
    return Math.min(diff, 360 - diff);
}
export function detectConjunctions(planetFacts, orbDegrees = 8.0) {
    const results = [];
    for (let i = 0; i < planetFacts.length; i++) {
        for (let j = i + 1; j < planetFacts.length; j++) {
            const pA = planetFacts[i];
            const pB = planetFacts[j];
            const diff = calculateAngularDistance(pA.longitude, pB.longitude);
            const detected = diff <= orbDegrees;
            results.push({
                planetA: pA.planet,
                planetB: pB.planet,
                longitudeDifference: Number(diff.toFixed(4)),
                orb: orbDegrees,
                detected,
            });
        }
    }
    return results;
}
