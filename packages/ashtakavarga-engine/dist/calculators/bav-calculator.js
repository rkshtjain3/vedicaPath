import { RASHIS } from '@vedica/astrology-core';
import { getAllowedRelativeHouses } from '../rules/bindu-rules.js';
import { getRelativeHouse } from '../utils/relative-house.js';
export const ASHTAKAVARGA_PLANETS = [
    'SUN',
    'MOON',
    'MARS',
    'MERCURY',
    'JUPITER',
    'VENUS',
    'SATURN',
];
export const ASHTAKAVARGA_CONTRIBUTORS = [
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
    'Lagna',
];
/**
 * Maps Ashtakavarga Planet name to rule contributor key.
 */
function getRuleContributorKey(contributor) {
    return contributor;
}
/**
 * Extracts contributor sign placements from a D1 BirthChart.
 */
export function extractContributorPlacements(chart) {
    const placements = {};
    // Lagna placement
    placements['Lagna'] = chart.lagna.sign;
    // Planet placements
    for (const p of chart.planets) {
        if (p.planet === 'Sun')
            placements['Sun'] = p.sign;
        if (p.planet === 'Moon')
            placements['Moon'] = p.sign;
        if (p.planet === 'Mars')
            placements['Mars'] = p.sign;
        if (p.planet === 'Mercury')
            placements['Mercury'] = p.sign;
        if (p.planet === 'Jupiter')
            placements['Jupiter'] = p.sign;
        if (p.planet === 'Venus')
            placements['Venus'] = p.sign;
        if (p.planet === 'Saturn')
            placements['Saturn'] = p.sign;
    }
    // Validate all 8 contributors exist
    for (const c of ASHTAKAVARGA_CONTRIBUTORS) {
        if (!placements[c]) {
            throw new Error(`Missing placement for Ashtakavarga contributor: ${c}`);
        }
    }
    return placements;
}
/**
 * Calculates Bhinna Ashtakavarga (BAV) for a single target planet across all 12 signs.
 */
export function calculateBAVForPlanet(targetPlanet, placements) {
    const signPoints = {};
    const signDetails = [];
    let totalPoints = 0;
    for (const targetSign of RASHIS) {
        let signBindus = 0;
        const contributorBreakdown = {};
        const signContributions = [];
        for (const contributor of ASHTAKAVARGA_CONTRIBUTORS) {
            const sourceSign = placements[contributor];
            const relHouse = getRelativeHouse(sourceSign.id, targetSign.id);
            const ruleKey = getRuleContributorKey(contributor);
            const allowedHouses = getAllowedRelativeHouses(targetPlanet, ruleKey);
            const isAllowed = allowedHouses.includes(relHouse);
            const binduVal = isAllowed ? 1 : 0;
            signBindus += binduVal;
            contributorBreakdown[contributor] = binduVal;
            const evidence = [
                `Target Planet: ${targetPlanet}`,
                `Contributor: ${contributor} (${sourceSign.name})`,
                `Target Sign: ${targetSign.name}`,
                `Relative House: ${relHouse}`,
                `Allowed Houses: [${allowedHouses.join(', ')}]`,
                `Result: Bindu = ${binduVal}`,
            ];
            signContributions.push({
                source: contributor,
                sourceSign,
                target: targetPlanet,
                targetSign,
                relativeHouse: relHouse,
                contributingHouses: allowedHouses,
                bindu: binduVal,
                evidence,
            });
        }
        signPoints[targetSign.name] = signBindus;
        totalPoints += signBindus;
        signDetails.push({
            sign: targetSign,
            bindus: signBindus,
            contributorBreakdown: contributorBreakdown,
            contributions: signContributions,
        });
    }
    return {
        planet: targetPlanet,
        signPoints,
        signDetails,
        totalPoints,
    };
}
/**
 * Calculates complete Bhinna Ashtakavarga (BAV) for all 7 planets.
 */
export function calculateAllBAVs(chart) {
    const placements = extractContributorPlacements(chart);
    const bavMap = {};
    for (const planet of ASHTAKAVARGA_PLANETS) {
        bavMap[planet] = calculateBAVForPlanet(planet, placements);
    }
    return bavMap;
}
