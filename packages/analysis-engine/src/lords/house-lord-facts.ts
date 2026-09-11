import { HouseFact, HouseLordFact, PlanetDignity, PlanetFact } from '../types/analysis-types.js';

export function calculateHouseLordFacts(
  houseFacts: HouseFact[],
  planetFacts: PlanetFact[],
  dignities: PlanetDignity[]
): HouseLordFact[] {
  return houseFacts.map((h) => {
    const lordFact = planetFacts.find((p) => p.planet === h.lord);
    const lordDignity = dignities.find((d) => d.planet === h.lord);

    return {
      house: h.house,
      lord: h.lord,
      lordHouse: lordFact ? lordFact.house : 0,
      lordSign: lordFact ? lordFact.sign : h.sign,
      dignity: lordDignity ? lordDignity.primaryDignity : 'NEUTRAL_SIGN',
      retrograde: lordFact ? lordFact.retrograde : false,
    };
  });
}
