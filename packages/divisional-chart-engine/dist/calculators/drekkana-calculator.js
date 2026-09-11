import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
/**
 * Transforms D1 sidereal longitude into D3 Drekkana divisional position.
 * Division size: 30° / 3 = 10°.
 *
 * In Parashara Drekkana:
 * - 1st part (0°-10°): Same sign
 * - 2nd part (10°-20°): 5th sign from it
 * - 3rd part (20°-30°): 9th sign from it
 */
export function calculateDrekkanaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 10;
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 3)
        divIndex = 2;
    const divisionNumber = divIndex + 1; // 1, 2, or 3
    const d3SignId = ((d1SignId - 1 + divIndex * 4) % 12) + 1;
    // Rescale degree within D3 sign (0° to 30°)
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD3 = Math.min(30, degInDiv * 3);
    const d3AbsoluteLongitude = (d3SignId - 1) * 30 + degInD3;
    const rashiResult = getRashiFromLongitude(d3AbsoluteLongitude);
    return {
        sign: RASHIS[d3SignId - 1],
        longitudeInSign: degInD3,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d3AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
