import { LifeDomain } from '../types.js';

export function extractLifeDomainRelevance(
  planetName: string,
  engineData: any
): LifeDomain[] {
  const domains: LifeDomain[] = [];
  const pLower = planetName.toLowerCase();
  const analysis = engineData.analysis || {};
  const houseLordFacts = analysis.houseLordFacts || [];

  const ownedHouses = houseLordFacts
    .filter((hf: any) => hf.lord?.toLowerCase() === pLower)
    .map((hf: any) => hf.house);

  // CAREER: 10th house, Saturn, Sun, D10
  if (ownedHouses.includes(10) || ownedHouses.includes(6) || pLower === 'saturn' || pLower === 'sun') {
    domains.push('CAREER');
  }

  // WEALTH: 2nd, 11th, 5th, 9th houses, Jupiter
  if (
    ownedHouses.includes(2) ||
    ownedHouses.includes(11) ||
    ownedHouses.includes(5) ||
    ownedHouses.includes(9) ||
    pLower === 'jupiter'
  ) {
    domains.push('WEALTH');
  }

  // RELATIONSHIPS: 7th house, Venus
  if (ownedHouses.includes(7) || pLower === 'venus') {
    domains.push('RELATIONSHIPS');
  }

  // HEALTH: 1st, 6th, 8th, 12th houses, Sun, Moon, Lagna lord
  if (
    ownedHouses.includes(1) ||
    ownedHouses.includes(6) ||
    ownedHouses.includes(8) ||
    ownedHouses.includes(12) ||
    pLower === 'sun' ||
    pLower === 'moon'
  ) {
    domains.push('HEALTH');
  }

  // EDUCATION: 4th, 5th houses, Mercury, Jupiter
  if (ownedHouses.includes(4) || ownedHouses.includes(5) || pLower === 'mercury' || pLower === 'jupiter') {
    domains.push('EDUCATION');
  }

  // PROPERTY: 4th house, Mars
  if (ownedHouses.includes(4) || pLower === 'mars') {
    domains.push('PROPERTY');
  }

  // SPIRITUALITY: 9th, 12th houses, Ketu, Jupiter
  if (ownedHouses.includes(9) || ownedHouses.includes(12) || pLower === 'ketu' || pLower === 'jupiter') {
    domains.push('SPIRITUALITY');
  }

  // Deduplicate
  return Array.from(new Set(domains));
}
