import { getRashiFromLongitude, RASHIS } from '@vedica/astrology-core';
import { DivisionalPosition } from '../types/divisional-types.js';
import { isOddSign } from './dashamsa-calculator.js';

export interface ShashtyamsaDeity {
  index: number; // 1 to 60
  name: string;
  isAuspicious: boolean;
}

export const SHASHTYAMSA_DEITIES: ShashtyamsaDeity[] = [
  { index: 1, name: 'Ghora', isAuspicious: false },
  { index: 2, name: 'Rakshasa', isAuspicious: false },
  { index: 3, name: 'Deva', isAuspicious: true },
  { index: 4, name: 'Kubera', isAuspicious: true },
  { index: 5, name: 'Yaksha', isAuspicious: true },
  { index: 6, name: 'Kinnara', isAuspicious: true },
  { index: 7, name: 'Bhrashta', isAuspicious: false },
  { index: 8, name: 'Kulaghna', isAuspicious: false },
  { index: 9, name: 'Garala', isAuspicious: false },
  { index: 10, name: 'Vahni', isAuspicious: false },
  { index: 11, name: 'Maya', isAuspicious: false },
  { index: 12, name: 'Purishaka', isAuspicious: false },
  { index: 13, name: 'Apampathi', isAuspicious: true },
  { index: 14, name: 'Marutvan', isAuspicious: true },
  { index: 15, name: 'Kaala', isAuspicious: false },
  { index: 16, name: 'Sarpa', isAuspicious: false },
  { index: 17, name: 'Amrita', isAuspicious: true },
  { index: 18, name: 'Indu', isAuspicious: true },
  { index: 19, name: 'Mridu', isAuspicious: true },
  { index: 20, name: 'Komala', isAuspicious: true },
  { index: 21, name: 'Heramba', isAuspicious: true },
  { index: 22, name: 'Brahma', isAuspicious: true },
  { index: 23, name: 'Vishnu', isAuspicious: true },
  { index: 24, name: 'Maheshwara', isAuspicious: true },
  { index: 25, name: 'Deva', isAuspicious: true },
  { index: 26, name: 'Ardra', isAuspicious: true },
  { index: 27, name: 'Kalinasa', isAuspicious: true },
  { index: 28, name: 'Kshitisvara', isAuspicious: true },
  { index: 29, name: 'Kamalakar', isAuspicious: true },
  { index: 30, name: 'Gulika', isAuspicious: false },
  { index: 31, name: 'Mrityu', isAuspicious: false },
  { index: 32, name: 'Kaala', isAuspicious: false },
  { index: 33, name: 'Davagni', isAuspicious: false },
  { index: 34, name: 'Ghora', isAuspicious: false },
  { index: 35, name: 'Yama', isAuspicious: false },
  { index: 36, name: 'Kantaka', isAuspicious: false },
  { index: 37, name: 'Sudha', isAuspicious: true },
  { index: 38, name: 'Amrita', isAuspicious: true },
  { index: 39, name: 'Purnachandra', isAuspicious: true },
  { index: 40, name: 'Vishadagdha', isAuspicious: false },
  { index: 41, name: 'Kulanasa', isAuspicious: false },
  { index: 42, name: 'Vamshakshaya', isAuspicious: false },
  { index: 43, name: 'Utpata', isAuspicious: false },
  { index: 44, name: 'Kala', isAuspicious: false },
  { index: 45, name: 'Saumya', isAuspicious: true },
  { index: 46, name: 'Komala', isAuspicious: true },
  { index: 47, name: 'Sitala', isAuspicious: true },
  { index: 48, name: 'Karaladamshtra', isAuspicious: false },
  { index: 49, name: 'Candramukhi', isAuspicious: true },
  { index: 50, name: 'Praveena', isAuspicious: true },
  { index: 51, name: 'Kalapavaka', isAuspicious: false },
  { index: 52, name: 'Dandayudha', isAuspicious: false },
  { index: 53, name: 'Nirmala', isAuspicious: true },
  { index: 54, name: 'Saumya', isAuspicious: true },
  { index: 55, name: 'Krura', isAuspicious: false },
  { index: 56, name: 'Atisitala', isAuspicious: true },
  { index: 57, name: 'Amrita', isAuspicious: true },
  { index: 58, name: 'Payodhicara', isAuspicious: true },
  { index: 59, name: 'Bhramana', isAuspicious: false },
  { index: 60, name: 'Chandrarekha', isAuspicious: true },
];

/**
 * Calculates D60 Shashtyamsa position and deity from D1 sidereal longitude.
 * D60 is considered the supreme divisional chart in Parashara Jyotish (highest Vimsopaka weight = 4.0/20),
 * revealing deep past-life karma and the ultimate destiny/fruits of planetary energies.
 * Division size: 30° / 60 = 0.5° (0° 30').
 * 
 * Classical Rule (BPHS):
 * - Sign: Count begins from the sign itself (1st) and proceeds directly.
 * - Deities: Odd signs count forward from 1 to 60. Even signs count in reverse from 60 down to 1.
 */
export function calculateShashtyamsaPosition(sourceLongitude: number): DivisionalPosition {
  let normalized = sourceLongitude % 360;
  if (normalized < 0) normalized += 360;
  const d1SignId = Math.floor(normalized / 30) + 1;
  const degInSign = normalized % 30;

  const divisionSize = 0.5; // 30 / 60
  let divIndex = Math.floor(degInSign / divisionSize);
  if (divIndex >= 60) divIndex = 59;
  if (divIndex < 0) divIndex = 0;
  const divisionNumber = divIndex + 1; // 1 to 60

  const d60SignId = ((d1SignId + divisionNumber - 2) % 12) + 1;

  const degInDiv = Math.max(0, degInSign - divIndex * divisionSize);
  const degInD60 = Math.min(30, degInDiv * 60);
  const d60AbsoluteLongitude = (d60SignId - 1) * 30 + degInD60;

  // Deity calculation: direct for odd signs, reverse for even signs
  const odd = isOddSign(d1SignId);
  const deityIndex = odd ? divisionNumber : 61 - divisionNumber;
  const deity = SHASHTYAMSA_DEITIES[deityIndex - 1] || SHASHTYAMSA_DEITIES[0];

  const rashiResult = getRashiFromLongitude(d60AbsoluteLongitude);

  return {
    sign: RASHIS[d60SignId - 1],
    longitudeInSign: degInD60,
    formattedDegree: rashiResult.formattedDegree,
    absoluteLongitude: d60AbsoluteLongitude,
    sourceLongitude,
    divisionNumber,
    deityName: deity.name,
    isAuspicious: deity.isAuspicious,
  };
}
