import { isTrikonaHouse } from '../../helpers/house-helpers.js';
import { evaluatePlanetRelationship } from '../../helpers/relationship-helpers.js';
export function evaluateDhanaYogas(houseLordFacts, planetFacts, conjunctions, aspects, methodologyVersion) {
    const results = [];
    // Helper for lord relationships
    const checkLordPairDhana = (id, name, houseA, houseB, desc) => {
        const lordA = houseLordFacts.find((h) => h.house === houseA)?.lord;
        const lordB = houseLordFacts.find((h) => h.house === houseB)?.lord;
        const conditions = [];
        const evidence = [];
        const validLords = Boolean(lordA && lordB && lordA !== lordB);
        conditions.push({
            id: `${id}_LORDS_VALID`,
            description: `${houseA}th and ${houseB}th house lords are distinct, valid planets`,
            passed: validLords,
            result: validLords,
            expectedValue: `Distinct lords for House ${houseA} and House ${houseB}`,
            actualValue: lordA && lordB ? `House ${houseA} Lord: ${lordA}, House ${houseB} Lord: ${lordB}` : 'Missing lords',
            evidence: validLords ? [`Lord of ${houseA} is ${lordA}, Lord of ${houseB} is ${lordB}`] : ['Missing/same lord'],
        });
        let associated = false;
        let relDetails = 'No relationship found.';
        if (validLords && lordA && lordB) {
            const rel = evaluatePlanetRelationship(lordA, lordB, houseA, houseB, planetFacts, conjunctions, aspects, houseLordFacts);
            associated = rel.associated;
            relDetails = rel.details;
            if (associated) {
                evidence.push({
                    type: rel.type === 'CONJUNCTION' ? 'CONJUNCTION' : rel.type === 'PARIVARTANA' ? 'HOUSE_RELATIONSHIP' : 'ASPECT',
                    planet: lordA,
                    targetPlanet: lordB,
                    details: [rel.details],
                });
            }
        }
        conditions.push({
            id: `${id}_RELATIONSHIP`,
            description: desc,
            passed: associated,
            result: associated,
            expectedValue: 'Association (Conjunction, Aspect, or Sign Exchange)',
            actualValue: relDetails,
            evidence: [relDetails],
        });
        const detected = conditions.every((c) => c.passed);
        return {
            id,
            name,
            category: 'DHANA',
            status: detected ? 'DETECTED' : 'NOT_DETECTED',
            detected,
            chartScope: 'D1',
            conditions,
            evidence,
            methodologyVersion,
            notes: [`Wealth Yoga: Association between ${houseA}th and ${houseB}th house lords.`],
        };
    };
    // 1. Dhana 2-11
    results.push(checkLordPairDhana('DHANA_YOGA_2_11', 'Dhana Yoga (2nd & 11th Lords)', 2, 11, '2nd Lord (Wealth) and 11th Lord (Gains) are associated via conjunction, aspect, or sign exchange'));
    // 2. Dhana 2-5
    results.push(checkLordPairDhana('DHANA_YOGA_2_5', 'Dhana Yoga (2nd & 5th Lords)', 2, 5, '2nd Lord (Wealth) and 5th Lord (Speculation/Purva Punya) are associated'));
    // 3. Dhana 5-9
    results.push(checkLordPairDhana('DHANA_YOGA_5_9', 'Dhana Yoga (5th & 9th Lords)', 5, 9, '5th Lord and 9th Lord (Lakshmi Sthanas / Trines) are associated'));
    // 4. 9th Lord in Wealth House (2nd or 11th)
    const lord9Fact = houseLordFacts.find((h) => h.house === 9);
    const lord9Planet = lord9Fact?.lord;
    const lord9InWealth = lord9Fact ? [2, 11].includes(lord9Fact.lordHouse) : false;
    const d9Conditions = [];
    const d9Evidence = [];
    d9Conditions.push({
        id: 'DHANA_YOGA_9_WEALTH_PLACEMENT',
        description: '9th Lord (Fortune/Dharma) is placed in a Wealth House (2nd or 11th)',
        passed: lord9InWealth,
        result: lord9InWealth,
        expectedValue: 'House 2 or House 11',
        actualValue: lord9Fact ? `${lord9Planet} (9th Lord) is in House ${lord9Fact.lordHouse}` : 'Missing',
        evidence: lord9Fact ? [`9th Lord (${lord9Planet}) occupies House ${lord9Fact.lordHouse}`] : ['Missing lord'],
    });
    if (lord9Fact && lord9Planet) {
        d9Evidence.push({
            type: 'HOUSE_LORDSHIP',
            planet: lord9Planet,
            house: lord9Fact.lordHouse,
            details: [`${lord9Planet} (9th Lord) is placed in House ${lord9Fact.lordHouse}`],
        });
    }
    results.push({
        id: 'DHANA_YOGA_9_WEALTH',
        name: 'Dhana Yoga (9th Lord in Wealth House)',
        category: 'DHANA',
        status: lord9InWealth ? 'DETECTED' : 'NOT_DETECTED',
        detected: lord9InWealth,
        chartScope: 'D1',
        conditions: d9Conditions,
        evidence: d9Evidence,
        methodologyVersion,
        notes: ['9th lord of fortune placed in 2nd (accumulated wealth) or 11th (gains).'],
    });
    // 5. 11th Lord in Trikona House (1st, 5th, or 9th)
    const lord11Fact = houseLordFacts.find((h) => h.house === 11);
    const lord11Planet = lord11Fact?.lord;
    const lord11InTrikona = lord11Fact ? isTrikonaHouse(lord11Fact.lordHouse) : false;
    const d11Conditions = [];
    const d11Evidence = [];
    d11Conditions.push({
        id: 'DHANA_YOGA_11_TRIKONA_PLACEMENT',
        description: '11th Lord (Gains/Income) is placed in a Trikona House (1st, 5th, or 9th)',
        passed: lord11InTrikona,
        result: lord11InTrikona,
        expectedValue: 'House 1, 5, or 9',
        actualValue: lord11Fact ? `${lord11Planet} (11th Lord) is in House ${lord11Fact.lordHouse}` : 'Missing',
        evidence: lord11Fact ? [`11th Lord (${lord11Planet}) occupies House ${lord11Fact.lordHouse}`] : ['Missing lord'],
    });
    if (lord11Fact && lord11Planet) {
        d11Evidence.push({
            type: 'HOUSE_LORDSHIP',
            planet: lord11Planet,
            house: lord11Fact.lordHouse,
            details: [`${lord11Planet} (11th Lord) is placed in Trikona House ${lord11Fact.lordHouse}`],
        });
    }
    results.push({
        id: 'DHANA_YOGA_11_TRIKONA',
        name: 'Dhana Yoga (11th Lord in Trikona)',
        category: 'DHANA',
        status: lord11InTrikona ? 'DETECTED' : 'NOT_DETECTED',
        detected: lord11InTrikona,
        chartScope: 'D1',
        conditions: d11Conditions,
        evidence: d11Evidence,
        methodologyVersion,
        notes: ['11th lord of gains placed in a trinal Lakshmi sthana (1, 5, 9).'],
    });
    return results;
}
