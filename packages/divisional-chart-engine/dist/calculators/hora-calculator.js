import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
/**
 * Transforms D1 sidereal longitude into D2 Hora divisional position.
 * Division size: 30° / 2 = 15°.
 *
 * In Parashara Hora:
 * - Odd signs (1, 3, 5, 7, 9, 11): 1st half is Leo (5), 2nd half is Cancer (4)
 * - Even signs (2, 4, 6, 8, 10, 12): 1st half is Cancer (4), 2nd half is Leo (5)
 */
export function calculateHoraPosition(sourceLongitude) {
    let normalized = sourceLongitude % 360;
    if (normalized < 0)
        normalized += 360;
    const d1SignId = Math.floor(normalized / 30) + 1;
    const degInSign = normalized % 30;
    const divisionSize = 15;
    let divIndex = Math.floor(degInSign / divisionSize);
    if (divIndex >= 2)
        divIndex = 1;
    const divisionNumber = divIndex + 1; // 1 or 2
    let d2SignId = 5; // Default Leo
    const isOddSign = d1SignId % 2 !== 0;
    if (isOddSign) {
        d2SignId = divisionNumber === 1 ? 5 : 4;
    }
    else {
        d2SignId = divisionNumber === 1 ? 4 : 5;
    }
    // Rescale degree within D2 sign (0° to 30°) cleanly
    const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
    const degInD2 = Math.min(30, degInDiv * 2);
    const d2AbsoluteLongitude = (d2SignId - 1) * 30 + degInD2;
    const rashiResult = getRashiFromLongitude(d2AbsoluteLongitude);
    return {
        sign: RASHIS[d2SignId - 1],
        longitudeInSign: degInD2,
        formattedDegree: rashiResult.formattedDegree,
        absoluteLongitude: d2AbsoluteLongitude,
        sourceLongitude,
        divisionNumber,
    };
}
