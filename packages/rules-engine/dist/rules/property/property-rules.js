import { isPlanetConnectedToHouse } from '../../core/connection-resolver.js';
export const propRule001 = {
    id: 'PROP-001',
    domain: 'PROPERTY',
    version: '1.0.0',
    evaluate(context) {
        const house4LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 4);
        if (!house4LordFact) {
            return {
                ruleId: 'PROP-001',
                domain: 'PROPERTY',
                triggered: false,
                effects: [],
                evidence: [],
                explanationKey: 'PROP_001_FAIL',
            };
        }
        const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
        const kendraTrikonaHouses = [1, 4, 5, 7, 9, 10];
        const isStrong = strongDignities.includes(house4LordFact.dignity);
        const isFavorableHouse = kendraTrikonaHouses.includes(house4LordFact.lordHouse);
        const evidence = [
            {
                type: 'PROPERTY_LORD_DIGNITY',
                house: 4,
                lord: house4LordFact.lord,
                dignity: house4LordFact.dignity,
                lordHouse: house4LordFact.lordHouse,
                details: `4th Lord ${house4LordFact.lord} has ${house4LordFact.dignity} dignity and is in House ${house4LordFact.lordHouse}`,
            },
        ];
        if (isStrong || isFavorableHouse) {
            return {
                ruleId: 'PROP-001',
                domain: 'PROPERTY',
                triggered: true,
                effects: [
                    { dimension: 'PropertyActivity', value: 2 },
                    { dimension: 'AcquisitionPotential', value: 2 },
                    { dimension: 'Stability', value: 2 },
                ],
                evidence,
                explanationKey: 'PROP_001_PASS',
            };
        }
        return {
            ruleId: 'PROP-001',
            domain: 'PROPERTY',
            triggered: false,
            effects: [],
            evidence,
            explanationKey: 'PROP_001_FAIL',
        };
    },
};
export const propRule002 = {
    id: 'PROP-002',
    domain: 'PROPERTY',
    version: '1.0.0',
    evaluate(context) {
        const marsConn = isPlanetConnectedToHouse('Mars', 4, context.analysis);
        if (marsConn.connected) {
            return {
                ruleId: 'PROP-002',
                domain: 'PROPERTY',
                triggered: true,
                effects: [
                    { dimension: 'PropertyActivity', value: 2 },
                    { dimension: 'AcquisitionPotential', value: 1 },
                ],
                evidence: [
                    {
                        type: 'MARS_PROPERTY_KARAKA_CONNECTION',
                        planet: 'Mars',
                        house: 4,
                        details: 'Mars (Property & Land Karaka) is connected to 4th house/lord',
                    },
                    ...marsConn.evidence,
                ],
                explanationKey: 'PROP_002_PASS',
            };
        }
        return {
            ruleId: 'PROP-002',
            domain: 'PROPERTY',
            triggered: false,
            effects: [],
            evidence: [
                {
                    type: 'MARS_PROPERTY_KARAKA_CONNECTION',
                    planet: 'Mars',
                    details: 'Mars does not connect directly to 4th house or 4th lord',
                },
            ],
            explanationKey: 'PROP_002_FAIL',
        };
    },
};
export const propRule003 = {
    id: 'PROP-003',
    domain: 'PROPERTY',
    version: '1.0.0',
    evaluate(context) {
        const mdLord = context.currentDasha?.mahadasha?.lord;
        const adLord = context.currentDasha?.antardasha?.lord;
        const evidence = [];
        let isConnected = false;
        if (mdLord) {
            const conn4 = isPlanetConnectedToHouse(mdLord, 4, context.analysis);
            if (conn4.connected) {
                isConnected = true;
                evidence.push({
                    type: 'DASHA_PROPERTY_CONNECTION',
                    dashaLevel: 'Mahadasha',
                    planet: mdLord,
                    details: `Mahadasha Lord ${mdLord} connected to 4th house of property`,
                });
                evidence.push(...conn4.evidence);
            }
        }
        if (adLord) {
            const conn4 = isPlanetConnectedToHouse(adLord, 4, context.analysis);
            if (conn4.connected) {
                isConnected = true;
                evidence.push({
                    type: 'DASHA_PROPERTY_CONNECTION',
                    dashaLevel: 'Antardasha',
                    planet: adLord,
                    details: `Antardasha Lord ${adLord} connected to 4th house of property`,
                });
                evidence.push(...conn4.evidence);
            }
        }
        if (isConnected) {
            return {
                ruleId: 'PROP-003',
                domain: 'PROPERTY',
                triggered: true,
                effects: [
                    { dimension: 'PropertyActivity', value: 2 },
                    { dimension: 'AcquisitionPotential', value: 2 },
                ],
                evidence,
                explanationKey: 'PROP_003_PASS',
            };
        }
        return {
            ruleId: 'PROP-003',
            domain: 'PROPERTY',
            triggered: false,
            effects: [],
            evidence: [
                {
                    type: 'DASHA_PROPERTY_CONNECTION',
                    details: 'Neither Mahadasha nor Antardasha lord connects directly to 4th house',
                },
            ],
            explanationKey: 'PROP_003_FAIL',
        };
    },
};
export const propRule004 = {
    id: 'PROP-004',
    domain: 'PROPERTY',
    version: '1.0.0',
    evaluate(context) {
        const trikLords = [6, 8, 12].map((h) => context.analysis.houseLordFacts.find((hl) => hl.house === h)?.lord).filter(Boolean);
        const house4Fact = context.analysis.houseFacts.find((h) => h.house === 4);
        const house4LordFact = context.analysis.houseLordFacts.find((hl) => hl.house === 4);
        const house4Lord = house4LordFact?.lord;
        const evidence = [];
        for (const trikLord of trikLords) {
            if (!trikLord)
                continue;
            if (house4Fact && house4Fact.planets.includes(trikLord)) {
                evidence.push({
                    type: 'TRIK_LORD_OCCUPIES_4TH_HOUSE',
                    planet: trikLord,
                    details: `Dusthana lord (${trikLord}) occupies 4th house`,
                });
            }
            const aspectingHouse4 = context.analysis.aspects.filter((asp) => asp.fromPlanet === trikLord && asp.toHouse === 4);
            for (const asp of aspectingHouse4) {
                evidence.push({
                    type: 'TRIK_LORD_ASPECTS_4TH_HOUSE',
                    planet: trikLord,
                    aspectNumber: asp.aspectNumber,
                    details: `Dusthana lord (${trikLord}) aspects 4th house`,
                });
            }
            if (house4Lord) {
                const aspectingLord4 = context.analysis.aspects.filter((asp) => asp.fromPlanet === trikLord && asp.targetPlanets.includes(house4Lord));
                for (const asp of aspectingLord4) {
                    evidence.push({
                        type: 'TRIK_LORD_ASPECTS_4TH_LORD',
                        planet: trikLord,
                        lord: house4Lord,
                        aspectNumber: asp.aspectNumber,
                        details: `Dusthana lord (${trikLord}) aspects 4th lord (${house4Lord})`,
                    });
                }
            }
        }
        if (evidence.length > 0) {
            return {
                ruleId: 'PROP-004',
                domain: 'PROPERTY',
                triggered: true,
                effects: [
                    { dimension: 'Obstacles', value: 2 },
                    { dimension: 'Stability', value: -1 },
                ],
                evidence,
                explanationKey: 'PROP_004_PASS',
            };
        }
        return {
            ruleId: 'PROP-004',
            domain: 'PROPERTY',
            triggered: false,
            effects: [],
            evidence: [
                {
                    type: 'PROPERTY_OBSTACLE_ANALYSIS',
                    details: 'No Dusthana lords (6th/8th/12th) occupy or aspect 4th house or 4th lord',
                },
            ],
            explanationKey: 'PROP_004_FAIL',
        };
    },
};
export const propertyRulesList = [
    propRule001,
    propRule002,
    propRule003,
    propRule004,
];
//# sourceMappingURL=property-rules.js.map