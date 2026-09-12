import { BirthChart, PlanetPosition } from '@vedica/astrology-core';
import { KujaDoshaDetails } from '../types/compatibility-types.js';

export function evaluateKujaDosha(chart: BirthChart, personName: string): KujaDoshaDetails {
  const mars = chart.planets.find((p: PlanetPosition) => p.planet === 'Mars');
  const lagnaLongitude = chart.lagna?.longitude ?? 0;
  const lagnaSignIndex = Math.floor(((lagnaLongitude % 360) + 360) % 360 / 30) + 1;

  if (!mars) {
    return {
      personName,
      hasKujaDosha: false,
      afflictedHouses: [],
      isCancelled: false,
      cancellationReasons: [],
    };
  }

  const marsSignIndex = Math.floor(((mars.longitude % 360) + 360) % 360 / 30) + 1;
  const marsHouseFromLagna = ((marsSignIndex - lagnaSignIndex + 12) % 12) + 1;

  const afflictedHouses: number[] = [];
  if ([1, 2, 4, 7, 8, 12].includes(marsHouseFromLagna)) {
    afflictedHouses.push(marsHouseFromLagna);
  }

  const hasDosha = afflictedHouses.length > 0;
  const cancellationReasons: string[] = [];

  // Cancellation checks
  if (hasDosha) {
    if (mars.sign.name === 'Aries' || mars.sign.name === 'Scorpio') {
      cancellationReasons.push('Mars is in its Own Sign.');
    }
    if (mars.sign.name === 'Capricorn') {
      cancellationReasons.push('Mars is Exalted.');
    }
    const jupiter = chart.planets.find((p: PlanetPosition) => p.planet === 'Jupiter');
    if (jupiter) {
      const jupSignIndex = Math.floor(((jupiter.longitude % 360) + 360) % 360 / 30) + 1;
      const diffJupMars = Math.abs(jupSignIndex - marsSignIndex);
      if (diffJupMars === 0 || diffJupMars === 4 || diffJupMars === 6 || diffJupMars === 8) {
        cancellationReasons.push('Jupiter aspects or conjoins Mars, nullifying affliction.');
      }
    }
  }

  const isCancelled = cancellationReasons.length > 0;

  return {
    personName,
    hasKujaDosha: hasDosha && !isCancelled,
    afflictedHouses,
    isCancelled,
    cancellationReasons,
  };
}
