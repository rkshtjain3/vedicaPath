import sweph from 'sweph';
import { getUTCInstant, BirthTimeInput } from '@vedica/shared';
import { AstrologyCalculationEngine } from './astrology-engine.interface.js';
import {
  AscendantDetails,
  BirthChart,
  ChartInput,
  PlanetName,
  PlanetPosition,
} from '../types/astrology.js';
import {
  CalculationProfile,
  DEFAULT_CALCULATION_PROFILE,
} from '../settings/calculation-profile.js';
import { getRashiFromLongitude } from '../houses/rashi-util.js';
import { getNakshatraFromLongitude } from '../nakshatra/nakshatra-util.js';

export class SwissEphemerisEngine implements AstrologyCalculationEngine {
  async calculateBirthChart(
    input: ChartInput,
    profile: CalculationProfile = DEFAULT_CALCULATION_PROFILE
  ): Promise<BirthChart> {
    const c = sweph.constants;

    let sidMode: number = c.SE_SIDM_LAHIRI;
    if (profile.ayanamsa === 'raman') {
      sidMode = c.SE_SIDM_RAMAN;
    } else if (profile.ayanamsa === 'krishnamurti') {
      sidMode = c.SE_SIDM_KRISHNAMURTI;
    }
    sweph.set_sid_mode(sidMode, 0, 0);

    const utcInstant = getUTCInstant(input.birthTime);
    const julianDay = sweph.julday(
      utcInstant.year,
      utcInstant.month,
      utcInstant.day,
      utcInstant.decimalHour,
      c.SE_GREG_CAL
    );

    const ayanamsaValue = sweph.get_ayanamsa_ut(julianDay);

    const houseRes = sweph.houses(
      julianDay,
      input.location.latitude,
      input.location.longitude,
      'P'
    );
    const tropicalAscendant = houseRes.data.points[0];
    const siderealAscendant = (tropicalAscendant - ayanamsaValue + 360) % 360;

    const lagnaRashi = getRashiFromLongitude(siderealAscendant);
    const lagnaNakshatra = getNakshatraFromLongitude(siderealAscendant);

    const lagna: AscendantDetails = {
      longitude: siderealAscendant,
      sign: lagnaRashi.rashi,
      degreeInSign: lagnaRashi.degreeInSign,
      formattedDegree: lagnaRashi.formattedDegree,
      nakshatra: lagnaNakshatra,
    };

    const flags = c.SEFLG_SIDEREAL | c.SEFLG_SPEED;
    const nodeConstant = profile.nodeType === 'mean' ? c.SE_MEAN_NODE : c.SE_TRUE_NODE;

    const planetMap: Record<string, number> = {
      Sun: c.SE_SUN,
      Moon: c.SE_MOON,
      Mars: c.SE_MARS,
      Mercury: c.SE_MERCURY,
      Jupiter: c.SE_JUPITER,
      Venus: c.SE_VENUS,
      Saturn: c.SE_SATURN,
      Rahu: nodeConstant,
    };

    const planets: PlanetPosition[] = [];

    for (const [name, planetId] of Object.entries(planetMap)) {
      const pName = name as PlanetName;
      const res = sweph.calc_ut(julianDay, planetId, flags);
      const longitude = (res.data[0] % 360 + 360) % 360;
      const speed = res.data[3];
      const isRetrograde = speed < 0;

      const rashiRes = getRashiFromLongitude(longitude);
      const nakshatraRes = getNakshatraFromLongitude(longitude);

      planets.push({
        planet: pName,
        longitude,
        sign: rashiRes.rashi,
        degreeInSign: rashiRes.degreeInSign,
        formattedDegree: rashiRes.formattedDegree,
        nakshatra: nakshatraRes,
        isRetrograde,
        speed,
      });
    }

    const rahuPosition = planets.find((p) => p.planet === 'Rahu')!;
    const ketuLongitude = (rahuPosition.longitude + 180) % 360;
    const ketuRashi = getRashiFromLongitude(ketuLongitude);
    const ketuNakshatra = getNakshatraFromLongitude(ketuLongitude);

    planets.push({
      planet: 'Ketu',
      longitude: ketuLongitude,
      sign: ketuRashi.rashi,
      degreeInSign: ketuRashi.degreeInSign,
      formattedDegree: ketuRashi.formattedDegree,
      nakshatra: ketuNakshatra,
      isRetrograde: rahuPosition.isRetrograde,
      speed: rahuPosition.speed,
    });

    const moonPlanet = planets.find((p) => p.planet === 'Moon')!;
    const moonSign = moonPlanet.sign;
    const birthNakshatra = moonPlanet.nakshatra;

    return {
      input,
      utcInstant,
      calculationProfile: profile,
      ayanamsaValue,
      lagna,
      moonSign,
      birthNakshatra,
      planets,
      calculationConfig: {
        zodiacType: 'SIDEREAL',
        ayanamsha: profile.ayanamsa || 'Lahiri',
        houseSystem: 'Whole Sign',
        nodeCalculation: profile.nodeType === 'mean' ? 'MEAN' : 'TRUE',
        ephemerisVersion: 'Swiss Ephemeris v2.10',
        calculationProfileVersion: 'personal-vedic-v1',
      },
    };
  }
}

export function calculateAstronomicalSunTimes(input: {
  birthTime: BirthTimeInput;
  location: { latitude: number; longitude: number };
}): { sunriseMinutes: number; sunsetMinutes: number } | null {
  try {
    const c = sweph.constants;
    const localMidnightUtc = getUTCInstant({
      dateOfBirth: input.birthTime.dateOfBirth,
      timeOfBirth: '00:00:00',
      timezone: input.birthTime.timezone,
    });
    const midnightJd = sweph.julday(
      localMidnightUtc.year,
      localMidnightUtc.month,
      localMidnightUtc.day,
      localMidnightUtc.decimalHour,
      c.SE_GREG_CAL
    );
    const geopos: [number, number, number] = [input.location.longitude, input.location.latitude, 0];
    const riseRes = sweph.rise_trans(midnightJd, c.SE_SUN, '', c.SEFLG_SWIEPH, c.SE_CALC_RISE, geopos, 0, 0);
    const setRes = sweph.rise_trans(midnightJd, c.SE_SUN, '', c.SEFLG_SWIEPH, c.SE_CALC_SET, geopos, 0, 0);

    if (
      !riseRes ||
      !setRes ||
      riseRes.flag !== 0 ||
      setRes.flag !== 0 ||
      typeof riseRes.data !== 'number' ||
      typeof setRes.data !== 'number'
    ) {
      return null;
    }

    const sunriseMinutes = Math.round((riseRes.data - midnightJd) * 24 * 60);
    const sunsetMinutes = Math.round((setRes.data - midnightJd) * 24 * 60);

    return { sunriseMinutes, sunsetMinutes };
  } catch {
    return null;
  }
}

