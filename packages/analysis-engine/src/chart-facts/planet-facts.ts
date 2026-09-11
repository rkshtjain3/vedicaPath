import { BirthChart } from '@vedica/astrology-core';
import { PlanetFact } from '../types/analysis-types.js';

export function calculatePlanetFacts(chart: BirthChart): PlanetFact[] {
  const lagnaSignIndex = chart.lagna.sign.id - 1; // 0-11

  return chart.planets.map((p) => {
    const planetSignIndex = p.sign.id - 1; // 0-11
    const house = ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;

    return {
      planet: p.planet,
      longitude: p.longitude,
      sign: p.sign.name,
      degreeInSign: p.degreeInSign,
      house,
      nakshatra: p.nakshatra.name,
      pada: p.nakshatra.pada,
      retrograde: p.isRetrograde,
    };
  });
}
