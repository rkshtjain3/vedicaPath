import { isTrikHouse } from '../../helpers/house-helpers.js';
import { evaluatePlanetRelationship } from '../../helpers/relationship-helpers.js';
export function evaluateRajaYogas(houseLordFacts, planetFacts, conjunctions, aspects, methodologyVersion) {
    const results = [];
    // 1. DHARMA_KARMADHIPATI_YOGA (9th & 10th Lords)
    const lord9 = houseLordFacts.find((h) => h.house === 9)?.lord;
    const lord10 = houseLordFacts.find((h) => h.house === 10)?.lord;
    const dkConditions = [];
    const dkEvidence = [];
    const lordsExist = Boolean(lord9 && lord10 && lord9 !== lord10);
    dkConditions.push({
        id: 'DHARMA_KARMA_LORDS_EXIST',
        description: '9th and 10th house lords are distinct, valid planets',
        passed: lordsExist,
        result: lordsExist,
        expectedValue: 'Distinct lords for 9th and 10th houses',
        actualValue: lord9 && lord10 ? `9th Lord: ${lord9}, 10th Lord: ${lord10}` : 'Missing lords',
        evidence: lordsExist ? [`9th Lord is ${lord9}, 10th Lord is ${lord10}`] : ['Same or missing lord'],
    });
    let dkRelationshipFound = false;
    if (lordsExist && lord9 && lord10) {
        const rel = evaluatePlanetRelationship(lord9, lord10, 9, 10, planetFacts, conjunctions, aspects, houseLordFacts);
        dkRelationshipFound = rel.associated;
        dkConditions.push({
            id: 'DHARMA_KARMA_RELATIONSHIP',
            description: '9th Lord and 10th Lord associated via conjunction, mutual aspect, direct aspect, or sign exchange',
            passed: dkRelationshipFound,
            result: dkRelationshipFound,
            expectedValue: 'Association (Conjunction, Aspect, or Exchange)',
            actualValue: rel.details,
            evidence: [rel.details],
        });
        dkEvidence.push({
            type: rel.type === 'CONJUNCTION' ? 'CONJUNCTION' : rel.type === 'PARIVARTANA' ? 'HOUSE_RELATIONSHIP' : 'ASPECT',
            planet: lord9,
            targetPlanet: lord10,
            details: [rel.details],
        });
    }
    const dkDetected = dkConditions.every((c) => c.passed);
    results.push({
        id: 'DHARMA_KARMADHIPATI_YOGA',
        name: 'Dharma-Karmadhipati Yoga (Raja Yoga)',
        category: 'RAJA',
        status: dkDetected ? 'DETECTED' : 'NOT_DETECTED',
        detected: dkDetected,
        chartScope: 'D1',
        conditions: dkConditions,
        evidence: dkEvidence,
        methodologyVersion,
        notes: ['Union or association of 9th lord (Dharma) and 10th lord (Karma).'],
    });
    // 2. KENDRA_TRIKONA_RAJA_YOGA (Any Kendra Lord + Trikona Lord)
    const ktConditions = [];
    const ktEvidence = [];
    const kendraHouses = [1, 4, 7, 10];
    const trikonaHouses = [5, 9]; // 1st house is both, handled separately
    let ktPairFound = false;
    let ktPairDetails = 'No Kendra-Trikona lord association detected.';
    for (const kHouse of kendraHouses) {
        const kLord = houseLordFacts.find((h) => h.house === kHouse)?.lord;
        if (!kLord)
            continue;
        for (const tHouse of trikonaHouses) {
            const tLord = houseLordFacts.find((h) => h.house === tHouse)?.lord;
            if (!tLord || kLord === tLord)
                continue;
            const rel = evaluatePlanetRelationship(kLord, tLord, kHouse, tHouse, planetFacts, conjunctions, aspects, houseLordFacts);
            if (rel.associated) {
                ktPairFound = true;
                ktPairDetails = `Lord of House ${kHouse} (${kLord}) and Lord of House ${tHouse} (${tLord}) are associated via ${rel.type}.`;
                ktEvidence.push({
                    type: rel.type === 'CONJUNCTION' ? 'CONJUNCTION' : rel.type === 'PARIVARTANA' ? 'HOUSE_RELATIONSHIP' : 'ASPECT',
                    planet: kLord,
                    targetPlanet: tLord,
                    details: [rel.details],
                });
                break;
            }
        }
        if (ktPairFound)
            break;
    }
    ktConditions.push({
        id: 'KENDRA_TRIKONA_ASSOCIATION',
        description: 'A Kendra lord (1, 4, 7, 10) and a Trikona lord (5, 9) are associated via conjunction, aspect, or sign exchange',
        passed: ktPairFound,
        result: ktPairFound,
        expectedValue: 'Kendra-Trikona Lord Association',
        actualValue: ktPairDetails,
        evidence: [ktPairDetails],
    });
    results.push({
        id: 'KENDRA_TRIKONA_RAJA_YOGA',
        name: 'Kendra-Trikona Raja Yoga',
        category: 'RAJA',
        status: ktPairFound ? 'DETECTED' : 'NOT_DETECTED',
        detected: ktPairFound,
        chartScope: 'D1',
        conditions: ktConditions,
        evidence: ktEvidence,
        methodologyVersion,
        notes: ['Association between a Kendra quadrant lord and a Trikona trine lord.'],
    });
    // 3. VIPARITA RAJA YOGAS (Harsha, Sarala, Vimala)
    const viparitaConfigs = [
        { id: 'VIPARITA_RAJA_YOGA_HARSHA', name: 'Viparita Raja Yoga (Harsha)', house: 6, desc: '6th Lord placed in 6th, 8th, or 12th house' },
        { id: 'VIPARITA_RAJA_YOGA_SARALA', name: 'Viparita Raja Yoga (Sarala)', house: 8, desc: '8th Lord placed in 6th, 8th, or 12th house' },
        { id: 'VIPARITA_RAJA_YOGA_VIMALA', name: 'Viparita Raja Yoga (Vimala)', house: 12, desc: '12th Lord placed in 6th, 8th, or 12th house' },
    ];
    for (const cfg of viparitaConfigs) {
        const vConditions = [];
        const vEvidence = [];
        const lordFact = houseLordFacts.find((h) => h.house === cfg.house);
        const lordPlanet = lordFact?.lord;
        const inTrikHouse = lordFact ? isTrikHouse(lordFact.lordHouse) : false;
        vConditions.push({
            id: `${cfg.id}_PLACEMENT`,
            description: cfg.desc,
            passed: inTrikHouse,
            result: inTrikHouse,
            expectedValue: 'Trik House (6, 8, 12)',
            actualValue: lordFact ? `${lordPlanet} (Lord of ${cfg.house}) is in House ${lordFact.lordHouse}` : 'Missing lord',
            evidence: lordFact ? [`Lord of ${cfg.house} (${lordPlanet}) occupies House ${lordFact.lordHouse}`] : ['Missing lord'],
        });
        if (lordFact && lordPlanet) {
            vEvidence.push({
                type: 'HOUSE_LORDSHIP',
                planet: lordPlanet,
                house: lordFact.lordHouse,
                details: [`${lordPlanet} is Lord of House ${cfg.house} placed in Trik House ${lordFact.lordHouse}`],
            });
        }
        const vDetected = vConditions.every((c) => c.passed);
        results.push({
            id: cfg.id,
            name: cfg.name,
            category: 'RAJA',
            status: vDetected ? 'DETECTED' : 'NOT_DETECTED',
            detected: vDetected,
            chartScope: 'D1',
            conditions: vConditions,
            evidence: vEvidence,
            methodologyVersion,
            notes: [`Classical Viparita Raja Yoga rule: Trik lord placed in a Trik house.`],
        });
    }
    return results;
}
