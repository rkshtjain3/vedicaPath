import { PlanetName, RashiDetails } from '../types/astrology.js';

export const RASHIS: RashiDetails[] = [
  { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' },
  { id: 2, name: 'Taurus', sanskritName: 'Vrishabha', ruler: 'Venus' },
  { id: 3, name: 'Gemini', sanskritName: 'Mithuna', ruler: 'Mercury' },
  { id: 4, name: 'Cancer', sanskritName: 'Karka', ruler: 'Moon' },
  { id: 5, name: 'Leo', sanskritName: 'Simha', ruler: 'Sun' },
  { id: 6, name: 'Virgo', sanskritName: 'Kanya', ruler: 'Mercury' },
  { id: 7, name: 'Libra', sanskritName: 'Tula', ruler: 'Venus' },
  { id: 8, name: 'Scorpio', sanskritName: 'Vrishchika', ruler: 'Mars' },
  { id: 9, name: 'Sagittarius', sanskritName: 'Dhanu', ruler: 'Jupiter' },
  { id: 10, name: 'Capricorn', sanskritName: 'Makara', ruler: 'Saturn' },
  { id: 11, name: 'Aquarius', sanskritName: 'Kumbha', ruler: 'Saturn' },
  { id: 12, name: 'Pisces', sanskritName: 'Meena', ruler: 'Jupiter' },
];

export function getRashiFromLongitude(longitude: number): { rashi: RashiDetails; degreeInSign: number; formattedDegree: string } {
  const normalized = (longitude % 360 + 360) % 360;
  const index = Math.floor(normalized / 30);
  const degreeInSign = normalized % 30;

  const deg = Math.floor(degreeInSign);
  const minFull = (degreeInSign - deg) * 60;
  const min = Math.floor(minFull);
  const sec = Math.round((minFull - min) * 60);

  const formattedDegree = `${deg}° ${String(min).padStart(2, '0')}' ${String(sec).padStart(2, '0')}"`;

  return {
    rashi: RASHIS[index],
    degreeInSign,
    formattedDegree,
  };
}
