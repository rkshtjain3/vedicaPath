import { PlanetLord } from '../vimshottari/canonical-vimshottari.js';

export type YoginiName =
  | 'MANGALA'
  | 'PINGALA'
  | 'DHANYA'
  | 'BHRAMARI'
  | 'BHADRIKA'
  | 'ULKA'
  | 'SIDDHA'
  | 'SANKATA';

export interface YoginiMetadata {
  name: YoginiName;
  sanskritName: string;
  hindiName: string;
  lord: PlanetLord;
  years: number;
  nature: 'BENEFIC' | 'MALEFIC';
  deity: string;
  significations: string;
}

export const TOTAL_YOGINI_YEARS = 36;

export const YOGINI_CYCLE: readonly YoginiMetadata[] = [
  {
    name: 'MANGALA',
    sanskritName: 'मङ्गला',
    hindiName: 'मंगला',
    lord: 'Moon',
    years: 1,
    nature: 'BENEFIC',
    deity: 'Matangi / Parvati',
    significations: 'Peace, mental clarity, auspicious beginnings, domestic happiness',
  },
  {
    name: 'PINGALA',
    sanskritName: 'पिङ्गला',
    hindiName: 'पिंगला',
    lord: 'Sun',
    years: 2,
    nature: 'MALEFIC',
    deity: 'Chandi / Surya Shakti',
    significations: 'Restlessness, authority challenges, physical exertion, heart vitality',
  },
  {
    name: 'DHANYA',
    sanskritName: 'धान्या',
    hindiName: 'धान्या',
    lord: 'Jupiter',
    years: 3,
    nature: 'BENEFIC',
    deity: 'Dhanalakshmi',
    significations: 'Wealth, prosperity, learning, spiritual advancement, grain abundance',
  },
  {
    name: 'BHRAMARI',
    sanskritName: 'भ्रामरी',
    hindiName: 'भ्रामरी',
    lord: 'Mars',
    years: 4,
    nature: 'MALEFIC',
    deity: 'Bhramari Devi',
    significations: 'Travel, displacement, agitation, competitive drive, swift actions',
  },
  {
    name: 'BHADRIKA',
    sanskritName: 'भद्रिका',
    hindiName: 'भद्रिका',
    lord: 'Mercury',
    years: 5,
    nature: 'BENEFIC',
    deity: 'Bhadrakali / Saraswati',
    significations: 'Intellect, commerce, family harmony, successful negotiations',
  },
  {
    name: 'ULKA',
    sanskritName: 'उल्का',
    hindiName: 'उल्का',
    lord: 'Saturn',
    years: 6,
    nature: 'MALEFIC',
    deity: 'Ulka Devi / Durga',
    significations: 'Obstacles, perseverance, delays, discipline, karmic cleansing',
  },
  {
    name: 'SIDDHA',
    sanskritName: 'सिद्ध',
    hindiName: 'सिद्ध',
    lord: 'Venus',
    years: 7,
    nature: 'BENEFIC',
    deity: 'Siddha Lakshmi / Bhuvaneshwari',
    significations: 'Accomplishment, wealth, arts, sensual pleasure, victory in ventures',
  },
  {
    name: 'SANKATA',
    sanskritName: 'संकटा',
    hindiName: 'संकटा',
    lord: 'Rahu',
    years: 8,
    nature: 'MALEFIC',
    deity: 'Sankata Devi / Chamunda',
    significations: 'Severe trials, transformative crises, intense spiritual sadhana',
  },
] as const;

/**
 * Returns the starting Yogini based on Janma Nakshatra index (0-26).
 * Classical rule: (Nakshatra Number (1-27) + 3) mod 8.
 * If remainder is 0, it maps to 8th Yogini (Sankata).
 */
export function getStartingYoginiFromNakshatra(nakshatraIndex0Based: number): YoginiMetadata {
  const nakshatraNumber1Based = nakshatraIndex0Based + 1; // 1 = Ashwini, 27 = Revati
  const remainder = (nakshatraNumber1Based + 3) % 8;
  const yoginiIndex = remainder === 0 ? 7 : remainder - 1; // 0-based index in YOGINI_CYCLE
  return YOGINI_CYCLE[yoginiIndex];
}
