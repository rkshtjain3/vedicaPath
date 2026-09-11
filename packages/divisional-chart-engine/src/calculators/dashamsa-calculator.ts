import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition } from '../types/divisional-types.js';

/**
 * Determines whether a Rashi ID (1-12) is an Odd sign or an Even sign.
 * Odd signs (Visham Rashi): Aries (1), Gemini (3), Leo (5), Libra (7), Sagittarius (9), Aquarius (11)
 * Even signs (Sama Rashi): Taurus (2), Cancer (4), Virgo (6), Scorpio (8), Capricorn (10), Pisces (12)
 */
export function isOddSign(rashiId: number): boolean {
  const normId = ((rashiId - 1) % 12) + 1;
  return normId % 2 !== 0;
}

/**
 * Calculates the starting sign (1-12) for D10 Dashamsa division sequence.
 * - Odd signs start from the sign itself (1st sign).
 * - Even signs start from the 9th sign counted from the sign itself.
 */
export function getDashamsaStartSign(rashiId: number): number {
  const normId = ((rashiId - 1) % 12) + 1;
  if (isOddSign(normId)) {
    return normId;
  }
  // 9th sign from normId
  return ((normId + 9 - 2) % 12) + 1;
}

/**
 * Transforms D1 sidereal longitude into D10 Dashamsa divisional position.
 * Division size: 30° / 10 = 3° = 3.0°.
 * Full floating point accuracy is preserved without intermediate rounding.
 */
export function calculateDashamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const divisionSize = 30 / 10; // 3.0°
  let divIndex = Math.floor(degInSign / divisionSize);
  if (divIndex >= 10) {
    divIndex = 9;
  }
  if (divIndex < 0) {
    divIndex = 0;
  }
  const divisionNumber = divIndex + 1; // 1 to 10

  const startSign = getDashamsaStartSign(d1SignId);
  const d10SignId = ((startSign + divisionNumber - 2) % 12) + 1;

  // Rescale degree within D10 sign (0° to 30°) cleanly without float modulo precision artifacts
  const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
  const degInD10 = Math.min(30, degInDiv * 10);
  const d10AbsoluteLongitude = (d10SignId - 1) * 30 + degInD10;

  const rashiResult = getRashiFromLongitude(d10AbsoluteLongitude);

  return {
    sign: RASHIS[d10SignId - 1],
    longitudeInSign: degInD10,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d10AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
  };
}
