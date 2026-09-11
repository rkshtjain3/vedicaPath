import { isKendraHouse, getRelativeHouseDistance } from '../../helpers/house-helpers.js';
import { getPlanetDignity, isDebilitated } from '../../helpers/dignity-helpers.js';
export function evaluateLunarYogas(planetFacts, dignities, methodologyVersion) {
    const results = [];
    const moonFact = planetFacts.find((p) => p.planet.toLowerCase() === 'moon');
    // 1. GAJAKESARI YOGA
    const gajakesariConditions = [];
    const gajakesariEvidence = [];
    const jupiterFact = planetFacts.find((p) => p.planet.toLowerCase() === 'jupiter');
    const jupiterDig = getPlanetDignity('Jupiter', dignities);
    let kendraFromMoon = false;
    let relDist = 0;
    if (jupiterFact && moonFact) {
        relDist = getRelativeHouseDistance(moonFact.house, jupiterFact.house);
        kendraFromMoon = isKendraHouse(relDist);
    }
    gajakesariConditions.push({
        id: 'GAJAKESARI_KENDRA',
        description: 'Jupiter is in a Kendra house (1st, 4th, 7th, or 10th) relative to the Moon',
        passed: kendraFromMoon,
        result: kendraFromMoon,
        expectedValue: 'Kendra relative distance (1, 4, 7, 10)',
        actualValue: jupiterFact && moonFact ? `${relDist}th house from Moon (Jupiter: H${jupiterFact.house}, Moon: H${moonFact.house})` : 'Missing planet',
        evidence: kendraFromMoon ? [`Jupiter is in the ${relDist}th house from Moon`] : ['Jupiter is not in a Kendra from Moon'],
    });
    const jupNotDebilitated = !isDebilitated(jupiterDig);
    gajakesariConditions.push({
        id: 'GAJAKESARI_NOT_DEBILITATED',
        description: 'Jupiter is not debilitated in the chart',
        passed: jupNotDebilitated,
        result: jupNotDebilitated,
        expectedValue: 'Primary dignity != DEBILITATED',
        actualValue: jupiterDig?.primaryDignity || 'UNKNOWN',
        evidence: [jupiterDig ? `Jupiter primary dignity is ${jupiterDig.primaryDignity}` : 'Dignity not found'],
    });
    if (jupiterFact && moonFact) {
        gajakesariEvidence.push({
            type: 'PLANET_POSITION',
            planet: 'Jupiter',
            targetPlanet: 'Moon',
            house: jupiterFact.house,
            details: [`Jupiter is in House ${jupiterFact.house}, Moon is in House ${moonFact.house}`],
        });
    }
    const gkDetected = gajakesariConditions.every((c) => c.passed);
    results.push({
        id: 'GAJAKESARI_YOGA',
        name: 'Gajakesari Yoga',
        category: 'LUNAR',
        status: gkDetected ? 'DETECTED' : 'NOT_DETECTED',
        detected: gkDetected,
        chartScope: 'D1',
        conditions: gajakesariConditions,
        evidence: gajakesariEvidence,
        methodologyVersion,
        notes: ['Jupiter in a quadrant (Kendra) from Moon, free from debilitation.'],
    });
    // Calculate 2nd and 12th houses relative to Moon
    const eligiblePlanets = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    let secondFromMoonPlanets = [];
    let twelfthFromMoonPlanets = [];
    let kendraFromLagnaPlanets = [];
    let kendraFromMoonPlanets = [];
    if (moonFact) {
        const secondHouseNum = ((moonFact.house % 12) + 1);
        const twelfthHouseNum = ((moonFact.house - 2 + 12) % 12) + 1;
        for (const p of planetFacts) {
            if (!eligiblePlanets.includes(p.planet))
                continue;
            if (p.house === secondHouseNum) {
                secondFromMoonPlanets.push(p.planet);
            }
            if (p.house === twelfthHouseNum) {
                twelfthFromMoonPlanets.push(p.planet);
            }
            if (isKendraHouse(p.house)) {
                kendraFromLagnaPlanets.push(p.planet);
            }
            const distFromMoon = getRelativeHouseDistance(moonFact.house, p.house);
            if (isKendraHouse(distFromMoon)) {
                kendraFromMoonPlanets.push(p.planet);
            }
        }
    }
    // 2. SUNAPHA YOGA
    const sunaphaPass = secondFromMoonPlanets.length > 0 && twelfthFromMoonPlanets.length === 0;
    results.push({
        id: 'SUNAPHA_YOGA',
        name: 'Sunapha Yoga',
        category: 'LUNAR',
        status: sunaphaPass ? 'DETECTED' : 'NOT_DETECTED',
        detected: sunaphaPass,
        chartScope: 'D1',
        conditions: [
            {
                id: 'SUNAPHA_PLANETS_2ND',
                description: 'Planets other than Sun/Rahu/Ketu occupy the 2nd house from Moon',
                passed: secondFromMoonPlanets.length > 0,
                result: secondFromMoonPlanets.length > 0,
                expectedValue: 'At least 1 eligible planet in 2nd from Moon',
                actualValue: secondFromMoonPlanets.length > 0 ? secondFromMoonPlanets.join(', ') : 'None',
                evidence: [secondFromMoonPlanets.length > 0 ? `Planets in 2nd from Moon: ${secondFromMoonPlanets.join(', ')}` : 'No eligible planets in 2nd from Moon'],
            },
            {
                id: 'SUNAPHA_12TH_EMPTY',
                description: '12th house from Moon is unoccupied by eligible planets',
                passed: twelfthFromMoonPlanets.length === 0,
                result: twelfthFromMoonPlanets.length === 0,
                expectedValue: '12th from Moon empty of eligible planets',
                actualValue: twelfthFromMoonPlanets.length > 0 ? twelfthFromMoonPlanets.join(', ') : 'Empty',
                evidence: [twelfthFromMoonPlanets.length === 0 ? '12th from Moon is empty' : `Occupied by: ${twelfthFromMoonPlanets.join(', ')}`],
            },
        ],
        evidence: [
            {
                type: 'PLANET_POSITION',
                planet: 'Moon',
                details: [
                    `Moon in House ${moonFact?.house || 'N/A'}. 2nd from Moon: [${secondFromMoonPlanets.join(', ')}], 12th from Moon: [${twelfthFromMoonPlanets.join(', ')}]`,
                ],
            },
        ],
        methodologyVersion,
        notes: ['Lunar Yoga formed by planet(s) in 2nd house from Moon (excluding Sun/nodes).'],
    });
    // 3. ANAPHA YOGA
    const anaphaPass = twelfthFromMoonPlanets.length > 0 && secondFromMoonPlanets.length === 0;
    results.push({
        id: 'ANAPHA_YOGA',
        name: 'Anapha Yoga',
        category: 'LUNAR',
        status: anaphaPass ? 'DETECTED' : 'NOT_DETECTED',
        detected: anaphaPass,
        chartScope: 'D1',
        conditions: [
            {
                id: 'ANAPHA_PLANETS_12TH',
                description: 'Planets other than Sun/Rahu/Ketu occupy the 12th house from Moon',
                passed: twelfthFromMoonPlanets.length > 0,
                result: twelfthFromMoonPlanets.length > 0,
                expectedValue: 'At least 1 eligible planet in 12th from Moon',
                actualValue: twelfthFromMoonPlanets.length > 0 ? twelfthFromMoonPlanets.join(', ') : 'None',
                evidence: [twelfthFromMoonPlanets.length > 0 ? `Planets in 12th from Moon: ${twelfthFromMoonPlanets.join(', ')}` : 'No eligible planets in 12th from Moon'],
            },
            {
                id: 'ANAPHA_2ND_EMPTY',
                description: '2nd house from Moon is unoccupied by eligible planets',
                passed: secondFromMoonPlanets.length === 0,
                result: secondFromMoonPlanets.length === 0,
                expectedValue: '2nd from Moon empty of eligible planets',
                actualValue: secondFromMoonPlanets.length > 0 ? secondFromMoonPlanets.join(', ') : 'Empty',
                evidence: [secondFromMoonPlanets.length === 0 ? '2nd from Moon is empty' : `Occupied by: ${secondFromMoonPlanets.join(', ')}`],
            },
        ],
        evidence: [
            {
                type: 'PLANET_POSITION',
                planet: 'Moon',
                details: [
                    `Moon in House ${moonFact?.house || 'N/A'}. 12th from Moon: [${twelfthFromMoonPlanets.join(', ')}], 2nd from Moon: [${secondFromMoonPlanets.join(', ')}]`,
                ],
            },
        ],
        methodologyVersion,
        notes: ['Lunar Yoga formed by planet(s) in 12th house from Moon (excluding Sun/nodes).'],
    });
    // 4. DURUDHARA YOGA
    const durudharaPass = secondFromMoonPlanets.length > 0 && twelfthFromMoonPlanets.length > 0;
    results.push({
        id: 'DURUDHARA_YOGA',
        name: 'Durudhara Yoga',
        category: 'LUNAR',
        status: durudharaPass ? 'DETECTED' : 'NOT_DETECTED',
        detected: durudharaPass,
        chartScope: 'D1',
        conditions: [
            {
                id: 'DURUDHARA_BOTH_HOUSES',
                description: 'Planets other than Sun/Rahu/Ketu occupy both 2nd and 12th houses from Moon',
                passed: durudharaPass,
                result: durudharaPass,
                expectedValue: 'Eligible planets in BOTH 2nd and 12th from Moon',
                actualValue: `2nd: [${secondFromMoonPlanets.join(', ')}], 12th: [${twelfthFromMoonPlanets.join(', ')}]`,
                evidence: [durudharaPass ? 'Both 2nd and 12th houses from Moon are occupied by eligible planets' : 'Not both 2nd and 12th houses occupied'],
            },
        ],
        evidence: [
            {
                type: 'PLANET_POSITION',
                planet: 'Moon',
                details: [
                    `Moon in House ${moonFact?.house || 'N/A'}. 2nd: [${secondFromMoonPlanets.join(', ')}], 12th: [${twelfthFromMoonPlanets.join(', ')}]`,
                ],
            },
        ],
        methodologyVersion,
        notes: ['Lunar Yoga formed when Moon has planets on both sides (2nd and 12th houses).'],
    });
    // 5. KEMADRUMA YOGA
    const noAdjacentPlanets = secondFromMoonPlanets.length === 0 && twelfthFromMoonPlanets.length === 0;
    const noKendraLagna = kendraFromLagnaPlanets.length === 0;
    const noKendraMoon = kendraFromMoonPlanets.length === 0;
    const kemadrumaPass = noAdjacentPlanets && (noKendraLagna || noKendraMoon);
    results.push({
        id: 'KEMADRUMA_YOGA',
        name: 'Kemadruma Yoga',
        category: 'LUNAR',
        status: kemadrumaPass ? 'DETECTED' : 'NOT_DETECTED',
        detected: kemadrumaPass,
        chartScope: 'D1',
        conditions: [
            {
                id: 'KEMADRUMA_NO_ADJACENT',
                description: 'No eligible planets (excluding Sun/nodes) in 2nd or 12th from Moon',
                passed: noAdjacentPlanets,
                result: noAdjacentPlanets,
                expectedValue: '2nd and 12th from Moon empty',
                actualValue: noAdjacentPlanets ? 'Empty' : `2nd: [${secondFromMoonPlanets.join(', ')}], 12th: [${twelfthFromMoonPlanets.join(', ')}]`,
                evidence: [noAdjacentPlanets ? '2nd and 12th from Moon are empty of eligible planets' : 'Adjacent houses occupied'],
            },
            {
                id: 'KEMADRUMA_CANCELLATION_CHECK',
                description: 'No eligible planets in Kendra houses from Lagna or Moon',
                passed: noKendraLagna || noKendraMoon,
                result: noKendraLagna || noKendraMoon,
                expectedValue: 'No Kendras occupied to cancel Kemadruma',
                actualValue: `Kendra from Lagna: [${kendraFromLagnaPlanets.join(', ')}], Kendra from Moon: [${kendraFromMoonPlanets.join(', ')}]`,
                evidence: [
                    noKendraLagna || noKendraMoon
                        ? 'No Kendra planets found to cancel Kemadruma'
                        : 'Kemadruma canceled by planets in Kendra',
                ],
            },
        ],
        evidence: [
            {
                type: 'PLANET_POSITION',
                planet: 'Moon',
                details: [
                    `Moon in House ${moonFact?.house || 'N/A'}. Kendras from Lagna: [${kendraFromLagnaPlanets.join(', ')}], Kendras from Moon: [${kendraFromMoonPlanets.join(', ')}]`,
                ],
            },
        ],
        methodologyVersion,
        notes: ['Classical isolated Moon Yoga evaluated with Kendra cancellation checks.'],
    });
    return results;
}
