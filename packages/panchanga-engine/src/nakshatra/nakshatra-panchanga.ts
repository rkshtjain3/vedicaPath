import { PlanetName } from '@vedica/astrology-core';
import { NakshatraPanchangaFact } from '../types/panchanga-types.js';

interface NakshatraMeta {
  index: number;
  name: string;
  sanskritName: string;
  lord: PlanetName;
  deity: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  animal: string;
}

export const NAKSHATRA_METADATA: NakshatraMeta[] = [
  { index: 1, name: 'Ashwini', sanskritName: 'अश्विनी', lord: 'Ketu', deity: 'Ashwini Kumaras', gana: 'Deva', animal: 'Horse' },
  { index: 2, name: 'Bharani', sanskritName: 'भरणी', lord: 'Venus', deity: 'Yama', gana: 'Manushya', animal: 'Elephant' },
  { index: 3, name: 'Krittika', sanskritName: 'कृत्तिका', lord: 'Sun', deity: 'Agni', gana: 'Rakshasa', animal: 'Sheep / Goat' },
  { index: 4, name: 'Rohini', sanskritName: 'रोहिणी', lord: 'Moon', deity: 'Brahma / Prajapati', gana: 'Manushya', animal: 'Serpent' },
  { index: 5, name: 'Mrigashira', sanskritName: 'मृगशिरा', lord: 'Mars', deity: 'Soma / Chandra', gana: 'Deva', animal: 'Serpent' },
  { index: 6, name: 'Ardra', sanskritName: 'आर्द्रा', lord: 'Rahu', deity: 'Rudra', gana: 'Manushya', animal: 'Dog' },
  { index: 7, name: 'Punarvasu', sanskritName: 'पुनर्वसु', lord: 'Jupiter', deity: 'Aditi', gana: 'Deva', animal: 'Cat' },
  { index: 8, name: 'Pushya', sanskritName: 'पुष्य', lord: 'Saturn', deity: 'Brihaspati', gana: 'Deva', animal: 'Goat / Ram' },
  { index: 9, name: 'Ashlesha', sanskritName: 'आश्लेषा', lord: 'Mercury', deity: 'Sarpas / Nagas', gana: 'Rakshasa', animal: 'Cat' },
  { index: 10, name: 'Magha', sanskritName: 'मघा', lord: 'Ketu', deity: 'Pitrus', gana: 'Rakshasa', animal: 'Rat' },
  { index: 11, name: 'Purva Phalguni', sanskritName: 'पूर्वाफाल्गुनी', lord: 'Venus', deity: 'Bhaga', gana: 'Manushya', animal: 'Rat' },
  { index: 12, name: 'Uttara Phalguni', sanskritName: 'उत्तराफाल्गुनी', lord: 'Sun', deity: 'Aryaman', gana: 'Manushya', animal: 'Cow' },
  { index: 13, name: 'Hasta', sanskritName: 'हस्त', lord: 'Moon', deity: 'Savitr', gana: 'Deva', animal: 'Buffalo' },
  { index: 14, name: 'Chitra', sanskritName: 'चित्रा', lord: 'Mars', deity: 'Vishwakarma', gana: 'Rakshasa', animal: 'Tiger' },
  { index: 15, name: 'Swati', sanskritName: 'स्वाति', lord: 'Rahu', deity: 'Vayu', gana: 'Deva', animal: 'Buffalo' },
  { index: 16, name: 'Vishakha', sanskritName: 'विशाखा', lord: 'Jupiter', deity: 'Indragni', gana: 'Rakshasa', animal: 'Tiger' },
  { index: 17, name: 'Anuradha', sanskritName: 'अनुराधा', lord: 'Saturn', deity: 'Mitra', gana: 'Deva', animal: 'Deer' },
  { index: 18, name: 'Jyeshta', sanskritName: 'ज्येष्ठा', lord: 'Mercury', deity: 'Indra', gana: 'Rakshasa', animal: 'Deer' },
  { index: 19, name: 'Mula', sanskritName: 'मूल', lord: 'Ketu', deity: 'Nirriti', gana: 'Rakshasa', animal: 'Dog' },
  { index: 20, name: 'Purva Ashadha', sanskritName: 'पूर्वाषाढा', lord: 'Venus', deity: 'Apas / Varuna', gana: 'Manushya', animal: 'Monkey' },
  { index: 21, name: 'Uttara Ashadha', sanskritName: 'उत्तराषाढा', lord: 'Sun', deity: 'Vishvadevas', gana: 'Manushya', animal: 'Mongoose' },
  { index: 22, name: 'Shravana', sanskritName: 'श्रवण', lord: 'Moon', deity: 'Vishnu', gana: 'Deva', animal: 'Monkey' },
  { index: 23, name: 'Dhanishta', sanskritName: 'धनिष्ठा', lord: 'Mars', deity: 'Ashta Vasus', gana: 'Rakshasa', animal: 'Lion' },
  { index: 24, name: 'Shatabhisha', sanskritName: 'शतभिषा', lord: 'Rahu', deity: 'Varuna', gana: 'Rakshasa', animal: 'Horse' },
  { index: 25, name: 'Purva Bhadrapada', sanskritName: 'पूर्वभाद्रपदा', lord: 'Jupiter', deity: 'Aja Ekapada', gana: 'Manushya', animal: 'Lion' },
  { index: 26, name: 'Uttara Bhadrapada', sanskritName: 'उत्तरभाद्रपदा', lord: 'Saturn', deity: 'Ahirbudhnya', gana: 'Manushya', animal: 'Cow' },
  { index: 27, name: 'Revati', sanskritName: 'रेवती', lord: 'Mercury', deity: 'Pushan', gana: 'Deva', animal: 'Elephant' },
];

export function calculateNakshatraPanchanga(moonLongitude: number): NakshatraPanchangaFact {
  const normalized = ((moonLongitude % 360) + 360) % 360;
  const nakshatraArc = 360 / 27; // 13.333333333333334
  const padaArc = nakshatraArc / 4; // 3.3333333333333335

  const nakIndex = Math.min(27, Math.floor(normalized / nakshatraArc) + 1);
  const elapsedDegrees = normalized % nakshatraArc;
  const pada = Math.min(4, Math.floor(elapsedDegrees / padaArc) + 1);
  const percentageElapsed = (elapsedDegrees / nakshatraArc) * 100;

  const meta = NAKSHATRA_METADATA[nakIndex - 1] || NAKSHATRA_METADATA[0];

  return {
    index: nakIndex,
    name: meta.name,
    sanskritName: meta.sanskritName,
    pada,
    lord: meta.lord,
    deity: meta.deity,
    gana: meta.gana,
    animal: meta.animal,
    element: 'VAYU',
    elapsedDegrees,
    percentageElapsed,
  };
}
