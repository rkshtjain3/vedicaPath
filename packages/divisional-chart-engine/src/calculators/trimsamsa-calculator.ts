import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition } from '../types/divisional-types.js';

interface TrimsamsaPart {
  limit: number;
  signIdOdd: number;
  signIdEven: number;
}

const TRIMSAMSA_PARTS: TrimsamsaPart[] = [
  { limit: 5, signIdOdd: 1, signIdEven: 2 },   // 0-5
  { limit: 10, signIdOdd: 11, signIdEven: 6 }, // 5-10 (Odd), 5-12 (Even -> limit is 12) - wait
];

// Let's define them separately for odd and even to be perfectly clean
const ODD_SIGN_PARTS = [
  { maxDeg: 5, signId: 1, size: 5 },   // Mars (Aries)
  { maxDeg: 10, signId: 11, size: 5 }, // Saturn (Aquarius)
  { maxDeg: 18, signId: 9, size: 8 },  // Jupiter (Sagittarius)
  { maxDeg: 25, signId: 3, size: 7 },  // Mercury (Gemini)
  { maxDeg: 30, signId: 7, size: 5 },  // Venus (Libra)
];

const EVEN_SIGN_PARTS = [
  { maxDeg: 5, signId: 2, size: 5 },   // Venus (Taurus)
  { maxDeg: 12, signId: 6, size: 7 },  // Mercury (Virgo)
  { maxDeg: 20, signId: 12, size: 8 }, // Jupiter (Pisces)
  { maxDeg: 25, signId: 10, size: 5 }, // Saturn (Capricorn)
  { maxDeg: 30, signId: 8, size: 5 },  // Mars (Scorpio)
];

/**
 * Transforms D1 sidereal longitude into D30 Trimsamsa divisional position.
 * Division sizes are irregular (5, 5, 8, 7, 5 or 5, 7, 8, 5, 5).
 */
export function calculateTrimsamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const isOddSign = d1SignId % 2 !== 0;
  const parts = isOddSign ? ODD_SIGN_PARTS : EVEN_SIGN_PARTS;

  let d30SignId = parts[parts.length - 1].signId;
  let divisionNumber = parts.length;
  let divisionStart = 0;
  let divisionSize = 30;

  for (let i = 0; i < parts.length; i++) {
    if (degInSign < parts[i].maxDeg || (i === parts.length - 1 && degInSign <= parts[i].maxDeg)) {
      d30SignId = parts[i].signId;
      divisionNumber = i + 1;
      divisionSize = parts[i].size;
      divisionStart = i === 0 ? 0 : parts[i - 1].maxDeg;
      break;
    }
  }

  // Rescale degree within D30 sign (0° to 30°)
  // If the division is 5°, we multiply by 6. If 8°, multiply by 30/8 = 3.75.
  const degInDiv = Math.max(0, degInSign - divisionStart);
  const scale = 30 / divisionSize;
  const degInD30 = Math.min(30, degInDiv * scale);
  const d30AbsoluteLongitude = (d30SignId - 1) * 30 + degInD30;

  const rashiResult = getRashiFromLongitude(d30AbsoluteLongitude);

  return {
    sign: RASHIS[d30SignId - 1],
    longitudeInSign: degInD30,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d30AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
  };
}
