import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
/**
 * Returns the sign category (Movable, Fixed, Dual) for a 1-based Rashi ID (1-12).
 * Movable (Chara): Aries (1), Cancer (4), Libra (7), Capricorn (10)
 * Fixed (Sthira): Taurus (2), Leo (5), Scorpio (8), Aquarius (11)
 * Dual (Dwisvabhava): Gemini (3), Virgo (6), Sagittarius (9), Pisces (12)
 */
export function getSignCategory(rashiId) {
    const normId = ((rashiId - 1) % 12) + 1;
    if ([1, 4, 7, 10].includes(normId))
        return 'MOVABLE';
    if ([2, 5, 8, 11].includes(normId))
        return 'FIXED';
    return 'DUAL';
}
/**
 * Calculates the starting sign (1-12) for D9 Navamsa division sequence.
 * - Movable signs start from the sign itself (1st sign).
 * - Fixed signs start from the 9th sign.
 * - Dual signs start from the 5th sign.
 */
export function getNavamsaStartSign(rashiId) {
    const category = getSignCategory(rashiId);
    if (category === 'MOVABLE') {
        return rashiId;
    }
    if (category === 'FIXED') {
        return ((rashiId + 8 - 1) % 12) + 1; // 9th sign
    }
    return ((rashiId + 4 - 1) % 12) + 1; // 5th sign
}
/**
 * Transforms D1 sidereal longitude into D9 Navamsa divisional position.
 * Division size: 30° / 9 = 3° 20' = 3.3333333333333335°.
 * Full floating point accuracy is preserved without intermediate rounding.
 */
export function calculateNavamsaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 30 / 9; // 3.3333333333333335°
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 9) {
        divIndex = 8;
    }
    const divisionNumber = divIndex + 1;
    const startSign = getNavamsaStartSign(d1SignId);
    const d9SignId = ((startSign + divisionNumber - 2) % 12) + 1;
    // Rescale degree within D9 sign (0° to 30°) cleanly without float modulo precision artifacts
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD9 = Math.min(30, degInDiv * 9);
    const d9AbsoluteLongitude = (d9SignId - 1) * 30 + degInD9;
    const rashiResult = getRashiFromLongitude(d9AbsoluteLongitude);
    return {
        sign: RASHIS[d9SignId - 1],
        longitudeInSign: degInD9,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d9AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
