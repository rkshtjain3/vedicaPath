import { PlanetName } from '@vedica/astrology-core';
import { PlanetDignityInput } from '../types/yoga-types.js';

export function getPlanetDignity(
  planet: PlanetName,
  dignities: PlanetDignityInput[]
): PlanetDignityInput | undefined {
  return dignities.find((d) => d.planet.toLowerCase() === planet.toLowerCase());
}

export function isDignified(dignity?: PlanetDignityInput): boolean {
  if (!dignity) return false;
  return (
    dignity.primaryDignity === 'OWN_SIGN' ||
    dignity.primaryDignity === 'EXALTED' ||
    dignity.primaryDignity === 'MOOLATRIKONA'
  );
}

export function isExalted(dignity?: PlanetDignityInput): boolean {
  if (!dignity) return false;
  return dignity.primaryDignity === 'EXALTED';
}

export function isDebilitated(dignity?: PlanetDignityInput): boolean {
  if (!dignity) return false;
  return dignity.primaryDignity === 'DEBILITATED';
}
