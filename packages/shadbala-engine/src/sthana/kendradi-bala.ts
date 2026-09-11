import { PlanetName } from '@vedica/astrology-core';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
import { virupasToRupas } from '../units/shadbala-units.js';

export type HousePlacementCategory = 'KENDRA' | 'PANAPHARA' | 'APOKLIMA';

export const KENDRADI_BALA_VIRUPAS_MAP: Record<HousePlacementCategory, number> = {
  KENDRA: 60,
  PANAPHARA: 30,
  APOKLIMA: 15,
};

export function getHousePlacementCategory(house: number): HousePlacementCategory {
  if ([1, 4, 7, 10].includes(house)) return 'KENDRA';
  if ([2, 5, 8, 11].includes(house)) return 'PANAPHARA';
  return 'APOKLIMA'; // 3, 6, 9, 12
}

/**
 * Calculates Kendradi Bala (Strength based on house type).
 *
 * Kendra Houses (1, 4, 7, 10)     = 60 Virupas (1.0 Rupa)
 * Panaphara Houses (2, 5, 8, 11)  = 30 Virupas (0.5 Rupa)
 * Apoklima Houses (3, 6, 9, 12)   = 15 Virupas (0.25 Rupa)
 */
export function calculateKendradiBala(planet: PlanetName, house: number): SthanaBalaSubcomponent {
  const category = getHousePlacementCategory(house);
  const virupas = KENDRADI_BALA_VIRUPAS_MAP[category];
  const rupas = virupasToRupas(virupas);

  const evidence = [
    `Planet: ${planet}`,
    `House: ${house}`,
    `House Category: ${category}`,
    `Kendradi Bala: ${virupas} Virupas (${rupas.toFixed(2)} Rupas)`,
  ];

  return {
    name: 'Kendradi Bala',
    subcomponentName: 'KENDRADI_BALA',
    virupas,
    rupas,
    formulaVersion: 'bphs-kendradi-v1',
    status: 'IMPLEMENTED_UNBENCHMARKED',
    inputs: {
      planet,
      house,
      category,
    },
    evidence,
  };
}
