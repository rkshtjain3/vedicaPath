import { NAISARGIKA_FRIENDSHIPS } from '@vedica/analysis-engine';
export const CLASSICAL_PLANETS = [
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
];
export function getNaturalRelationship(planetA, planetB) {
    if (planetA === planetB)
        return 'FRIEND';
    const entry = NAISARGIKA_FRIENDSHIPS[planetA];
    if (!entry)
        return 'NEUTRAL';
    if (entry.friends.includes(planetB))
        return 'FRIEND';
    if (entry.enemies.includes(planetB))
        return 'ENEMY';
    return 'NEUTRAL';
}
export function getTemporaryRelationship(planetA, planetB, chart) {
    if (planetA === planetB)
        return 'ENEMY';
    const posA = chart.planets.find((p) => p.planet === planetA);
    const posB = chart.planets.find((p) => p.planet === planetB);
    if (!posA || !posB)
        return 'ENEMY';
    // Relative house distance from planetA to planetB
    const houseDist = ((posB.sign.id - posA.sign.id + 12) % 12) + 1;
    // Temporary Friends: 2nd, 3rd, 4th, 10th, 11th, 12th houses from planetA
    if ([2, 3, 4, 10, 11, 12].includes(houseDist)) {
        return 'FRIEND';
    }
    // Temporary Enemies: 1st, 5th, 6th, 7th, 8th, 9th houses from planetA
    return 'ENEMY';
}
export function computePanchadhaMaitri(natural, temporary) {
    if (natural === 'FRIEND' && temporary === 'FRIEND')
        return 'GREAT_FRIEND';
    if (natural === 'FRIEND' && temporary === 'ENEMY')
        return 'NEUTRAL';
    if (natural === 'NEUTRAL' && temporary === 'FRIEND')
        return 'FRIEND';
    if (natural === 'NEUTRAL' && temporary === 'ENEMY')
        return 'ENEMY';
    if (natural === 'ENEMY' && temporary === 'FRIEND')
        return 'NEUTRAL';
    // natural === 'ENEMY' && temporary === 'ENEMY'
    return 'GREAT_ENEMY';
}
export function getCompoundRelationship(planetA, planetB, chart) {
    const natural = getNaturalRelationship(planetA, planetB);
    const temporary = getTemporaryRelationship(planetA, planetB, chart);
    const compound = computePanchadhaMaitri(natural, temporary);
    const posA = chart.planets.find((p) => p.planet === planetA);
    const posB = chart.planets.find((p) => p.planet === planetB);
    const houseDist = posA && posB ? ((posB.sign.id - posA.sign.id + 12) % 12) + 1 : 1;
    const explanation = `${planetA} → ${planetB}: Natural = ${natural}, Temporary = ${temporary} (${houseDist}${getOrdinalSuffix(houseDist)} house relative placement). Compound (Panchadha Maitri) = ${compound}.`;
    return {
        planetA,
        planetB,
        naturalRelationship: natural,
        temporaryRelationship: temporary,
        compoundRelationship: compound,
        explanation,
    };
}
export function calculateRelationshipMatrix(chart) {
    const matrix = {};
    for (const pA of CLASSICAL_PLANETS) {
        matrix[pA] = {};
        for (const pB of CLASSICAL_PLANETS) {
            matrix[pA][pB] = getCompoundRelationship(pA, pB, chart);
        }
    }
    return matrix;
}
function getOrdinalSuffix(n) {
    if (n === 1)
        return 'st';
    if (n === 2)
        return 'nd';
    if (n === 3)
        return 'rd';
    return 'th';
}
