import { TransitHouseContext, TransitPosition } from '../types.js';

export function evaluateTransitHouseContexts(
  transits: TransitPosition[]
): TransitHouseContext[] {
  const houseContexts: TransitHouseContext[] = [];

  const naturalBenefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const naturalMalefics = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];

  for (const tr of transits) {
    const hL = tr.houseFromLagna;
    const hM = tr.houseFromMoon;

    let classification: 'SUPPORTIVE_CONTEXT' | 'NEUTRAL_CONTEXT' | 'CHALLENGING_CONTEXT' = 'NEUTRAL_CONTEXT';
    let explanation = `${tr.planet} is transiting natal house ${hL} from Lagna and house ${hM} from Moon.`;

    if (naturalBenefics.includes(tr.planet)) {
      if ([1, 4, 5, 7, 9, 10, 11].includes(hL)) {
        classification = 'SUPPORTIVE_CONTEXT';
        explanation = `Benefic ${tr.planet} is currently transiting favorable natal house ${hL} from Lagna.`;
      } else if ([6, 8, 12].includes(hL)) {
        classification = 'CHALLENGING_CONTEXT';
        explanation = `Benefic ${tr.planet} is currently transiting trik house ${hL} from Lagna.`;
      }
    } else if (naturalMalefics.includes(tr.planet)) {
      if ([3, 6, 11].includes(hL)) {
        classification = 'SUPPORTIVE_CONTEXT';
        explanation = `Malefic ${tr.planet} is currently transiting upachaya house ${hL} from Lagna, emphasizing strength and effort.`;
      } else if ([8, 12, 1, 7].includes(hL)) {
        classification = 'CHALLENGING_CONTEXT';
        explanation = `Malefic ${tr.planet} is currently transiting sensitive house ${hL} from Lagna.`;
      }
    }

    houseContexts.push({
      planet: tr.planet,
      houseFromLagna: hL,
      houseFromMoon: hM,
      classification,
      explanation,
      whyEvidence: [
        `Planet: ${tr.planet} in ${tr.sign.name} (${tr.formattedDegree})`,
        `House from Lagna: ${hL} | House from Moon: ${hM}`,
        `Classification: ${classification}`,
        explanation,
      ],
    });
  }

  return houseContexts;
}
