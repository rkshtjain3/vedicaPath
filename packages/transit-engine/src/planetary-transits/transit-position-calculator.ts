import { SwissEphemerisEngine } from '@vedica/astrology-core';
import { DEFAULT_TRANSIT_PROFILE, TransitCalculationProfile } from '../profile.js';
import { TransitCalculationConfiguration, TransitPosition } from '../types.js';

export async function calculateTransitPositions(
  transitDate: Date,
  natalLagnaLongitude: number,
  natalMoonLongitude: number,
  natalSunLongitude: number,
  profile: TransitCalculationProfile = DEFAULT_TRANSIT_PROFILE
): Promise<{
  configuration: TransitCalculationConfiguration;
  planets: TransitPosition[];
}> {
  const engine = new SwissEphemerisEngine();

  // Create chart input for transit date
  const birthTime = {
    dateOfBirth: transitDate.toISOString().split('T')[0],
    timeOfBirth: transitDate.toISOString().split('T')[1].substring(0, 8),
    timezone: 'UTC',
  };

  const location = {
    latitude: 0,
    longitude: 0,
    name: 'UTC Reference',
    timezone: 'UTC',
  };

  const chart = await engine.calculateBirthChart(
    { birthTime, location },
    {
      name: profile.version,
      version: profile.version,
      zodiac: profile.zodiac,
      ayanamsa: profile.ayanamsa,
      houseSystem: 'whole_sign',
      nodeType: profile.nodeType,
      dashaSystem: 'vimshottari',
    }
  );

  const lagnaRashiIndex = Math.floor(natalLagnaLongitude / 30);
  const moonRashiIndex = Math.floor(natalMoonLongitude / 30);
  const sunRashiIndex = Math.floor(natalSunLongitude / 30);

  const planets: TransitPosition[] = chart.planets.map((p) => {
    const transitRashiIndex = Math.floor(p.longitude / 30);

    const houseFromLagna = ((transitRashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    const houseFromMoon = ((transitRashiIndex - moonRashiIndex + 12) % 12) + 1;
    const houseFromSun = ((transitRashiIndex - sunRashiIndex + 12) % 12) + 1;

    return {
      planet: p.planet,
      longitude: p.longitude,
      sign: p.sign,
      degreeInSign: p.degreeInSign,
      formattedDegree: p.formattedDegree,
      nakshatra: p.nakshatra,
      isRetrograde: p.isRetrograde,
      speed: p.speed,
      houseFromLagna,
      houseFromMoon,
      houseFromSun,
      calculationTimestamp: transitDate.toISOString(),
    };
  });

  const configuration: TransitCalculationConfiguration = {
    zodiac: 'SIDEREAL',
    ayanamsha: profile.ayanamsa,
    nodeType: profile.nodeType === 'mean' ? 'MEAN' : 'TRUE',
    ephemerisVersion: 'Swiss Ephemeris v2.10',
    profileVersion: profile.version,
    conjunctionToleranceDegrees: profile.conjunctionToleranceDegrees,
  };

  return {
    configuration,
    planets,
  };
}
