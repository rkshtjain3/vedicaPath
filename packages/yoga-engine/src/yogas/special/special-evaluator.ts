import { areConjunct } from '../../helpers/conjunction-helpers.js';
import { isKendraHouse, isKendraFromHouse } from '../../helpers/house-helpers.js';
import { planetAspectsPlanet } from '../../helpers/aspect-helpers.js';
import { YogaResult, YogaCondition, YogaEvidence, PlanetFactInput, HouseLordFactInput, ConjunctionResultInput, VedicAspectInput, PlanetDignityInput } from '../../types/yoga-types.js';

export function evaluateSpecialYogas(
  planetFacts: PlanetFactInput[],
  houseLordFacts: HouseLordFactInput[],
  conjunctions: ConjunctionResultInput[],
  aspects: VedicAspectInput[],
  dignities: PlanetDignityInput[],
  methodologyVersion: string
): YogaResult[] {
  const results: YogaResult[] = [];

  // 1. BUDHA_ADITYA_YOGA
  const baConditions: YogaCondition[] = [];
  const baEvidence: YogaEvidence[] = [];

  const sunFact = planetFacts.find((p) => p.planet.toLowerCase() === 'sun');
  const mercFact = planetFacts.find((p) => p.planet.toLowerCase() === 'mercury');

  const conjRes = areConjunct('Sun', 'Mercury', planetFacts, conjunctions);

  baConditions.push({
    id: 'BUDHA_ADITYA_CONJUNCTION',
    description: 'Sun and Mercury are conjunct in the same house or within conjunction orb',
    passed: conjRes.conjunct,
    result: conjRes.conjunct,
    expectedValue: 'Sun and Mercury conjunct',
    actualValue: conjRes.details,
    evidence: [conjRes.details],
  });

  if (sunFact && mercFact) {
    baEvidence.push({
      type: 'CONJUNCTION',
      planet: 'Sun',
      targetPlanet: 'Mercury',
      house: sunFact.house,
      details: [conjRes.details],
    });
  }

  const baDetected = baConditions.every((c) => c.passed);
  results.push({
    id: 'BUDHA_ADITYA_YOGA',
    name: 'Budha-Aditya Yoga',
    category: 'SPECIAL',
    status: baDetected ? 'DETECTED' : 'NOT_DETECTED',
    detected: baDetected,
    chartScope: 'D1',
    conditions: baConditions,
    evidence: baEvidence,
    methodologyVersion,
    notes: ['Union of Sun (Aditya) and Mercury (Budha) in the same sign/house or within orb.'],
  });

  // 2. NEECHA_BHANGA_RAJA_YOGA
  const nbConditions: YogaCondition[] = [];
  const nbEvidence: YogaEvidence[] = [];

  const debilitatedPlanets = dignities.filter((d) => d.primaryDignity === 'DEBILITATED');
  let nbDetected = false;
  let nbDetails = 'No debilitated planets found in chart.';

  if (debilitatedPlanets.length > 0) {
    const moonFact = planetFacts.find((p) => p.planet.toLowerCase() === 'moon');

    for (const deb of debilitatedPlanets) {
      const pFact = planetFacts.find((p) => p.planet.toLowerCase() === deb.planet.toLowerCase());
      if (!pFact) continue;

      const debHouseFact = houseLordFacts.find((h) => h.house === pFact.house);
      const signLord = debHouseFact?.lord;

      let lordInKendraLagna = false;
      let lordInKendraMoon = false;

      if (signLord) {
        const lordFact = planetFacts.find((p) => p.planet.toLowerCase() === signLord.toLowerCase());
        if (lordFact) {
          lordInKendraLagna = isKendraHouse(lordFact.house);
          if (moonFact) {
            lordInKendraMoon = isKendraFromHouse(moonFact.house, lordFact.house);
          }
        }
      }

      if (lordInKendraLagna || lordInKendraMoon) {
        nbDetected = true;
        const source = lordInKendraLagna ? 'Lagna' : 'Moon';
        nbDetails = `Debilitated planet ${deb.planet} (House ${pFact.house}) has its sign lord ${signLord} in a Kendra house from ${source}.`;
        nbEvidence.push({
          type: 'CANCELLATION',
          planet: deb.planet,
          targetPlanet: signLord,
          details: [nbDetails],
        });
        break;
      }
    }
  }

  nbConditions.push({
    id: 'NEECHA_BHANGA_CANCELLATION',
    description: 'At least one debilitated planet has its sign lord in a Kendra house from Lagna or Moon',
    passed: nbDetected,
    result: nbDetected,
    expectedValue: 'Debilitated planet with sign lord in Kendra',
    actualValue: nbDetails,
    evidence: [nbDetails],
  });

  results.push({
    id: 'NEECHA_BHANGA_RAJA_YOGA',
    name: 'Neecha-Bhanga Raja Yoga',
    category: 'SPECIAL',
    status: nbDetected ? 'DETECTED' : 'NOT_DETECTED',
    detected: nbDetected,
    chartScope: 'D1',
    conditions: nbConditions,
    evidence: nbEvidence,
    methodologyVersion,
    notes: ['Cancellation of debilitation converting into Raja Yoga through dispositor Kendra placement.'],
  });

  // 3. PARIVARTANA_YOGA
  const parivartanaConditions: YogaCondition[] = [];
  const parivartanaEvidence: YogaEvidence[] = [];

  let parivartanaFound = false;
  let parivartanaDetails = 'No sign exchange between house lords found.';

  for (let hA = 1; hA <= 12; hA++) {
    for (let hB = hA + 1; hB <= 12; hB++) {
      const factA = houseLordFacts.find((h) => h.house === hA);
      const factB = houseLordFacts.find((h) => h.house === hB);

      if (factA && factB && factA.lord !== factB.lord) {
        if (factA.lordHouse === hB && factB.lordHouse === hA) {
          parivartanaFound = true;
          parivartanaDetails = `Sign Exchange (Parivartana) between ${factA.lord} (Lord of H${hA} in H${hB}) and ${factB.lord} (Lord of H${hB} in H${hA}).`;
          parivartanaEvidence.push({
            type: 'HOUSE_RELATIONSHIP',
            planet: factA.lord,
            targetPlanet: factB.lord,
            details: [parivartanaDetails],
          });
          break;
        }
      }
    }
    if (parivartanaFound) break;
  }

  parivartanaConditions.push({
    id: 'PARIVARTANA_EXCHANGE',
    description: 'Two house lords occupy each other\'s rashi/house (Sign Exchange)',
    passed: parivartanaFound,
    result: parivartanaFound,
    expectedValue: 'Mutual sign exchange between house lords',
    actualValue: parivartanaDetails,
    evidence: [parivartanaDetails],
  });

  results.push({
    id: 'PARIVARTANA_YOGA',
    name: 'Parivartana Yoga (Sign Exchange)',
    category: 'SPECIAL',
    status: parivartanaFound ? 'DETECTED' : 'NOT_DETECTED',
    detected: parivartanaFound,
    chartScope: 'D1',
    conditions: parivartanaConditions,
    evidence: parivartanaEvidence,
    methodologyVersion,
    notes: ['Exchange of rashis/houses between two planets.'],
  });

  // 4. CHANDRA_MANGALA_YOGA
  const cmConditions: YogaCondition[] = [];
  const cmEvidence: YogaEvidence[] = [];

  const moonFact = planetFacts.find((p) => p.planet.toLowerCase() === 'moon');
  const marsFact = planetFacts.find((p) => p.planet.toLowerCase() === 'mars');

  let cmAssociated = false;
  let cmDetails = 'Moon and Mars have no direct conjunction or mutual 7th aspect.';

  if (moonFact && marsFact) {
    const conj = areConjunct('Moon', 'Mars', planetFacts, conjunctions);
    const aspect7 = planetAspectsPlanet('Moon', 'Mars', planetFacts, aspects) && planetAspectsPlanet('Mars', 'Moon', planetFacts, aspects);

    if (conj.conjunct) {
      cmAssociated = true;
      cmDetails = `Moon and Mars are conjunct in House ${moonFact.house}.`;
    } else if (aspect7) {
      cmAssociated = true;
      cmDetails = `Moon (House ${moonFact.house}) and Mars (House ${marsFact.house}) are in 7th mutual aspect.`;
    }
  }

  cmConditions.push({
    id: 'CHANDRA_MANGALA_ASSOCIATION',
    description: 'Moon and Mars are in conjunction or mutual 7th aspect',
    passed: cmAssociated,
    result: cmAssociated,
    expectedValue: 'Moon-Mars Conjunction or Mutual Aspect',
    actualValue: cmDetails,
    evidence: [cmDetails],
  });

  if (moonFact && marsFact && cmAssociated) {
    cmEvidence.push({
      type: 'CONJUNCTION',
      planet: 'Moon',
      targetPlanet: 'Mars',
      details: [cmDetails],
    });
  }

  results.push({
    id: 'CHANDRA_MANGALA_YOGA',
    name: 'Chandra-Mangala Yoga',
    category: 'SPECIAL',
    status: cmAssociated ? 'DETECTED' : 'NOT_DETECTED',
    detected: cmAssociated,
    chartScope: 'D1',
    conditions: cmConditions,
    evidence: cmEvidence,
    methodologyVersion,
    notes: ['Union or mutual opposition/aspect between Moon (Chandra) and Mars (Mangala).'],
  });

  return results;
}
