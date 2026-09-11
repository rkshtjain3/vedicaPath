import sweph from 'sweph';
import { BirthChart, RASHIS, PlanetName } from '@vedica/astrology-core';
import { TransitPosition } from '../types/timing-types.js';

export class TransitCalculationEngine {
  private cache: Map<string, TransitPosition[]> = new Map();

  async calculateTransit(
    instant: Date,
    natalChart: BirthChart
  ): Promise<TransitPosition[]> {
    const isoStr = instant.toISOString();
    const dateOfBirth = isoStr.split('T')[0];
    const timeOfBirth = isoStr.split('T')[1].substring(0, 8);
    const lagnaSignId = natalChart.lagna?.sign?.id || 1;
    const cacheKey = `${dateOfBirth}_${timeOfBirth}_${lagnaSignId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const c = sweph.constants;
    let sidMode: number = c.SE_SIDM_LAHIRI;
    if (natalChart.calculationProfile?.ayanamsa === 'raman') {
      sidMode = c.SE_SIDM_RAMAN;
    } else if (natalChart.calculationProfile?.ayanamsa === 'krishnamurti') {
      sidMode = c.SE_SIDM_KRISHNAMURTI;
    }
    sweph.set_sid_mode(sidMode, 0, 0);

    const year = instant.getUTCFullYear();
    const month = instant.getUTCMonth() + 1;
    const day = instant.getUTCDate();
    const hour =
      instant.getUTCHours() +
      instant.getUTCMinutes() / 60 +
      instant.getUTCSeconds() / 3600;

    const julianDay = sweph.julday(year, month, day, hour, c.SE_GREG_CAL);
    const flags = c.SEFLG_SIDEREAL | c.SEFLG_SPEED;

    const nodeConstant =
      natalChart.calculationProfile?.nodeType === 'mean'
        ? c.SE_MEAN_NODE
        : c.SE_TRUE_NODE;

    const planetIds: Array<[string, number]> = [
      ['Sun', c.SE_SUN],
      ['Moon', c.SE_MOON],
      ['Mars', c.SE_MARS],
      ['Mercury', c.SE_MERCURY],
      ['Jupiter', c.SE_JUPITER],
      ['Venus', c.SE_VENUS],
      ['Saturn', c.SE_SATURN],
      ['Rahu', nodeConstant],
    ];

    const lagnaSignIndex = lagnaSignId - 1; // 0-11

    const result: TransitPosition[] = planetIds.map(([name, id]) => {
      const res = sweph.calc_ut(julianDay, id, flags);
      const longitude = ((res.data[0] % 360) + 360) % 360;
      const signIndex = Math.floor(longitude / 30) + 1; // 1-12
      const degreeInSign = longitude % 30;
      const isRetrograde = res.data[3] < 0;
      const transitSignIndex = signIndex - 1; // 0-11
      const natalHouse = ((transitSignIndex - lagnaSignIndex + 12) % 12) + 1;
      const rashi = RASHIS[transitSignIndex];

      return {
        planet: name as PlanetName,
        longitude,
        signIndex,
        signName: rashi ? rashi.name : 'Aries',
        degreeInSign,
        isRetrograde,
        natalHouse,
      };
    });

    const rahuPosition = result.find((p) => p.planet === 'Rahu')!;
    const ketuLongitude = (rahuPosition.longitude + 180) % 360;
    const ketuSignIndex = Math.floor(ketuLongitude / 30) + 1;
    const ketuSignIndex0 = ketuSignIndex - 1;
    const ketuNatalHouse = ((ketuSignIndex0 - lagnaSignIndex + 12) % 12) + 1;
    const ketuRashi = RASHIS[ketuSignIndex0];

    result.push({
      planet: 'Ketu',
      longitude: ketuLongitude,
      signIndex: ketuSignIndex,
      signName: ketuRashi ? ketuRashi.name : 'Aries',
      degreeInSign: ketuLongitude % 30,
      isRetrograde: rahuPosition.isRetrograde,
      natalHouse: ketuNatalHouse,
    });

    this.cache.set(cacheKey, result);
    return result;
  }
}
