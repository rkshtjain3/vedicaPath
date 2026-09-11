import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
/**
 * Transforms D1 sidereal longitude into D12 Dwadashamsa divisional position.
 * Division size: 30° / 12 = 2.5°.
 *
 * In Parashara Dwadashamsa:
 * - Always start counting from the sign itself sequentially.
 */
export function calculateDwadashamsaPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 30 / 12; // 2.5°
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 12)
        divIndex = 11;
    const divisionNumber = divIndex + 1;
    const d12SignId = ((d1SignId - 1 + divIndex) % 12) + 1;
    // Rescale degree within D12 sign (0° to 30°) cleanly
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD12 = Math.min(30, degInDiv * 12);
    const d12AbsoluteLongitude = (d12SignId - 1) * 30 + degInD12;
    const rashiResult = getRashiFromLongitude(d12AbsoluteLongitude);
    return {
        sign: RASHIS[d12SignId - 1],
        longitudeInSign: degInD12,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d12AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
