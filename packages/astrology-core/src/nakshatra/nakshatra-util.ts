import { NakshatraDetails, PlanetName } from '../types/astrology.js';

export interface NakshatraDefinition {
  id: number;
  name: string;
  ruler: PlanetName;
}

export const NAKSHATRAS: NakshatraDefinition[] = [
  { id: 1, name: 'Ashwini', ruler: 'Ketu' },
  { id: 2, name: 'Bharani', ruler: 'Venus' },
  { id: 3, name: 'Krittika', ruler: 'Sun' },
  { id: 4, name: 'Rohini', ruler: 'Moon' },
  { id: 5, name: 'Mrigashira', ruler: 'Mars' },
  { id: 6, name: 'Ardra', ruler: 'Rahu' },
  { id: 7, name: 'Punarvasu', ruler: 'Jupiter' },
  { id: 8, name: 'Pushya', ruler: 'Saturn' },
  { id: 9, name: 'Ashlesha', ruler: 'Mercury' },
  { id: 10, name: 'Magha', ruler: 'Ketu' },
  { id: 11, name: 'Purva Phalguni', ruler: 'Venus' },
  { id: 12, name: 'Uttara Phalguni', ruler: 'Sun' },
  { id: 13, name: 'Hasta', ruler: 'Moon' },
  { id: 14, name: 'Chitra', ruler: 'Mars' },
  { id: 15, name: 'Swati', ruler: 'Rahu' },
  { id: 16, name: 'Vishakha', ruler: 'Jupiter' },
  { id: 17, name: 'Anuradha', ruler: 'Saturn' },
  { id: 18, name: 'Jyeshtha', ruler: 'Mercury' },
  { id: 19, name: 'Mula', ruler: 'Ketu' },
  { id: 20, name: 'Purva Ashadha', ruler: 'Venus' },
  { id: 21, name: 'Uttara Ashadha', ruler: 'Sun' },
  { id: 22, name: 'Shravana', ruler: 'Moon' },
  { id: 23, name: 'Dhanishta', ruler: 'Mars' },
  { id: 24, name: 'Shatabhisha', ruler: 'Rahu' },
  { id: 25, name: 'Purva Bhadrapada', ruler: 'Jupiter' },
  { id: 26, name: 'Uttara Bhadrapada', ruler: 'Saturn' },
  { id: 27, name: 'Revati', ruler: 'Mercury' },
];

export function getNakshatraFromLongitude(longitude: number): NakshatraDetails {
  const normalized = (longitude % 360 + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13.333333333333334
  const index = Math.floor(normalized / nakshatraSpan);
  const remainder = normalized % nakshatraSpan;
  const padaSpan = nakshatraSpan / 4; // 3.3333333333333335
  const pada = Math.floor(remainder / padaSpan) + 1;

  const def = NAKSHATRAS[index];
  return {
    id: def.id,
    name: def.name,
    ruler: def.ruler,
    pada: Math.min(pada, 4),
  };
}
