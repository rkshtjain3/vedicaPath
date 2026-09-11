import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition } from '../types/divisional-types.js';

/**
 * Transforms D1 sidereal longitude into D7 Saptamsa divisional position.
 * Division size: 30° / 7 = 4.285714285714286°.
 * 
 * In Parashara Saptamsa:
 * - Odd signs: Start counting from the sign itself.
 * - Even signs: Start counting from the 7th sign from it.
 */
export function calculateSaptamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const divisionSize = 30 / 7;
  let divIndex = Math.floor(degInSign / divisionSize);
  if (divIndex >= 7) divIndex = 6;
  const divisionNumber = divIndex + 1;

  const isOddSign = d1SignId % 2 !== 0;
  const startSignId = isOddSign ? d1SignId : ((d1SignId + 5) % 12) + 1; // 7th sign

  const d7SignId = ((startSignId - 1 + divIndex) % 12) + 1;

  // Rescale degree within D7 sign (0° to 30°) cleanly
  const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
  const degInD7 = Math.min(30, degInDiv * 7);
  const d7AbsoluteLongitude = (d7SignId - 1) * 30 + degInD7;

  const rashiResult = getRashiFromLongitude(d7AbsoluteLongitude);

  return {
    sign: RASHIS[d7SignId - 1],
    longitudeInSign: degInD7,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d7AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
  };
}
