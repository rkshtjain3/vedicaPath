import { isPlanetConnectedToHouse } from '@vedica/rules-engine';
const DOMAIN_HOUSES = {
    CAREER: [10],
    WEALTH: [2, 11],
    RELATIONSHIPS: [7],
    PROPERTY: [4],
};
export function evaluateDashaLevelForDomain(dashaLevel, lord, domain, analysis, profile) {
    if (!lord) {
        return {
            dashaLevel,
            lord: 'Sun',
            connected: false,
            score: 0,
            evidence: [],
        };
    }
    const targetHouses = DOMAIN_HOUSES[domain] || [];
    let isConnected = false;
    const combinedEvidence = [];
    for (const house of targetHouses) {
        const res = isPlanetConnectedToHouse(lord, house, analysis);
        if (res.connected) {
            isConnected = true;
            combinedEvidence.push(...res.evidence);
        }
    }
    const weight = profile.dashaWeights[dashaLevel] || 0;
    const score = isConnected ? weight : 0;
    return {
        dashaLevel,
        lord,
        connected: isConnected,
        score,
        evidence: combinedEvidence,
    };
}
export function evaluateMultiLevelDashaActivation(dasha, domain, analysis, profile) {
    const mdLord = dasha.mahadasha?.lord;
    const adLord = dasha.antardasha?.lord;
    const pdLord = dasha.pratyantardasha?.lord;
    const mahadasha = evaluateDashaLevelForDomain('MAHADASHA', mdLord, domain, analysis, profile);
    const antardasha = evaluateDashaLevelForDomain('ANTARDASHA', adLord, domain, analysis, profile);
    const pratyantardasha = evaluateDashaLevelForDomain('PRATYANTARDASHA', pdLord, domain, analysis, profile);
    const totalScore = mahadasha.score + antardasha.score + pratyantardasha.score;
    return {
        domain,
        mahadasha,
        antardasha,
        pratyantardasha,
        totalScore,
    };
}
//# sourceMappingURL=dasha-activation.js.map