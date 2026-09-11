export type PlanetLord =
  | 'Ketu'
  | 'Venus'
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Rahu'
  | 'Jupiter'
  | 'Saturn'
  | 'Mercury';

export interface VimshottariLordConfig {
  lord: PlanetLord;
  years: number;
}

export const VIMSHOTTARI_CYCLE: VimshottariLordConfig[] = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

export const TOTAL_VIMSHOTTARI_YEARS = 120;

export const NAKSHATRA_LORDS: PlanetLord[] = [
  'Ketu',     // 1. Ashwini
  'Venus',    // 2. Bharani
  'Sun',      // 3. Krittika
  'Moon',     // 4. Rohini
  'Mars',     // 5. Mrigashira
  'Rahu',     // 6. Ardra
  'Jupiter',  // 7. Punarvasu
  'Saturn',   // 8. Pushya
  'Mercury',  // 9. Ashlesha
  'Ketu',     // 10. Magha
  'Venus',    // 11. Purva Phalguni
  'Sun',      // 12. Uttara Phalguni
  'Moon',     // 13. Hasta
  'Mars',     // 14. Chitra
  'Rahu',     // 15. Swati
  'Jupiter',  // 16. Vishakha
  'Saturn',   // 17. Anuradha
  'Mercury',  // 18. Jyeshtha
  'Ketu',     // 19. Mula
  'Venus',    // 20. Purva Ashadha
  'Sun',      // 21. Uttara Ashadha
  'Moon',     // 22. Shravana
  'Mars',     // 23. Dhanishta
  'Rahu',     // 24. Shatabhisha
  'Jupiter',  // 25. Purva Bhadrapada
  'Saturn',   // 26. Uttara Bhadrapada
  'Mercury',  // 27. Revati
];

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];
