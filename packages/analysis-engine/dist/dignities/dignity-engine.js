import { SIGN_LORDS } from '../houses/house-facts.js';
export const EXALTATION = {
    Sun: { sign: 'Aries', degree: 10 },
    Moon: { sign: 'Taurus', degree: 3 },
    Mars: { sign: 'Capricorn', degree: 28 },
    Mercury: { sign: 'Virgo', degree: 15 },
    Jupiter: { sign: 'Cancer', degree: 5 },
    Venus: { sign: 'Pisces', degree: 27 },
    Saturn: { sign: 'Libra', degree: 20 },
};
export const DEBILITATION = {
    Sun: { sign: 'Libra', degree: 10 },
    Moon: { sign: 'Scorpio', degree: 3 },
    Mars: { sign: 'Cancer', degree: 28 },
    Mercury: { sign: 'Pisces', degree: 15 },
    Jupiter: { sign: 'Capricorn', degree: 5 },
    Venus: { sign: 'Virgo', degree: 27 },
    Saturn: { sign: 'Aries', degree: 20 },
};
export const MOOLATRIKONA = {
    Sun: { sign: 'Leo', maxDegree: 20 },
    Moon: { sign: 'Taurus', maxDegree: 30 },
    Mars: { sign: 'Aries', maxDegree: 12 },
    Mercury: { sign: 'Virgo', maxDegree: 20 },
    Jupiter: { sign: 'Sagittarius', maxDegree: 10 },
    Venus: { sign: 'Libra', maxDegree: 15 },
    Saturn: { sign: 'Aquarius', maxDegree: 20 },
};
export const OWN_SIGNS = {
    Sun: ['Leo'],
    Moon: ['Cancer'],
    Mars: ['Aries', 'Scorpio'],
    Mercury: ['Gemini', 'Virgo'],
    Jupiter: ['Sagittarius', 'Pisces'],
    Venus: ['Taurus', 'Libra'],
    Saturn: ['Capricorn', 'Aquarius'],
};
export const NAISARGIKA_FRIENDSHIPS = {
    Sun: { friends: ['Moon', 'Mars', 'Jupiter'], neutral: ['Mercury'], enemies: ['Venus', 'Saturn'] },
    Moon: { friends: ['Sun', 'Mercury'], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
    Mars: { friends: ['Sun', 'Moon', 'Jupiter'], neutral: ['Venus', 'Saturn'], enemies: ['Mercury'] },
    Mercury: { friends: ['Sun', 'Venus'], neutral: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
    Jupiter: { friends: ['Sun', 'Moon', 'Mars'], neutral: ['Saturn'], enemies: ['Mercury', 'Venus'] },
    Venus: { friends: ['Mercury', 'Saturn'], neutral: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
    Saturn: { friends: ['Mercury', 'Venus'], neutral: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] },
};
export function getLordRelationship(planet, signLord) {
    if (planet === signLord)
        return 'FRIENDLY';
    const friendship = NAISARGIKA_FRIENDSHIPS[planet];
    if (!friendship)
        return 'NEUTRAL';
    if (friendship.friends.includes(signLord))
        return 'FRIENDLY';
    if (friendship.enemies.includes(signLord))
        return 'ENEMY';
    return 'NEUTRAL';
}
export function calculatePlanetDignity(p) {
    const signLord = SIGN_LORDS[p.sign];
    // 1. Exaltation
    const ex = EXALTATION[p.planet];
    if (ex && ex.sign === p.sign) {
        return {
            planet: p.planet,
            sign: p.sign,
            primaryDignity: 'EXALTED',
            relationshipToSignLord: getLordRelationship(p.planet, signLord),
        };
    }
    // 2. Debilitation
    const deb = DEBILITATION[p.planet];
    if (deb && deb.sign === p.sign) {
        return {
            planet: p.planet,
            sign: p.sign,
            primaryDignity: 'DEBILITATED',
            relationshipToSignLord: getLordRelationship(p.planet, signLord),
        };
    }
    // 3. Moolatrikona
    const mt = MOOLATRIKONA[p.planet];
    if (mt && mt.sign === p.sign && p.degreeInSign <= mt.maxDegree) {
        return {
            planet: p.planet,
            sign: p.sign,
            primaryDignity: 'MOOLATRIKONA',
            relationshipToSignLord: getLordRelationship(p.planet, signLord),
        };
    }
    // 4. Own Sign
    const own = OWN_SIGNS[p.planet];
    if (own && own.includes(p.sign)) {
        return {
            planet: p.planet,
            sign: p.sign,
            primaryDignity: 'OWN_SIGN',
            relationshipToSignLord: 'FRIENDLY',
        };
    }
    // 5. Sign Lord Relationship
    const rel = getLordRelationship(p.planet, signLord);
    let primaryDignity = 'NEUTRAL_SIGN';
    if (rel === 'FRIENDLY')
        primaryDignity = 'FRIENDLY_SIGN';
    if (rel === 'ENEMY')
        primaryDignity = 'ENEMY_SIGN';
    return {
        planet: p.planet,
        sign: p.sign,
        primaryDignity,
        relationshipToSignLord: rel,
    };
}
export function calculateAllDignities(planetFacts) {
    return planetFacts.map((p) => calculatePlanetDignity(p));
}
