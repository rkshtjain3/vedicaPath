/**
 * Safe extractor for planetary strength information across shadbala, strengthAnalysis, and astrology facts.
 */
export function getPlanetStrengthInfo(planet: string, engineData: any) {
  const shad = engineData.shadbala?.planets?.find((p: any) => p.planet === planet);
  const str = engineData.strengthAnalysis?.planets?.find((p: any) => p.planet === planet);
  const astro = engineData.astrology?.planets?.find((p: any) => p.planet === planet);

  const isStrong =
    shad?.isStrong === true ||
    (typeof shad?.ratio === 'number' && shad.ratio >= 1.0) ||
    str?.overallStrength === 'STRONG' ||
    str?.overallStrength === 'VERY_STRONG' ||
    str?.overallStrength === 'EXCELLENT';

  const isWeak =
    astro?.dignity === 'DEBILITATED' ||
    str?.overallStrength === 'WEAK' ||
    str?.overallStrength === 'VERY_WEAK' ||
    (typeof shad?.ratio === 'number' && shad.ratio < 0.95);

  const rupas =
    typeof shad?.totalRupa === 'number'
      ? shad.totalRupa
      : typeof shad?.partialTotalRupas === 'number'
      ? shad.partialTotalRupas
      : undefined;

  const ratio = typeof shad?.ratio === 'number' ? shad.ratio : undefined;

  return {
    planet,
    isStrong,
    isWeak,
    rupas,
    ratio,
    overallStrength: str?.overallStrength,
    dignity: astro?.dignity || str?.d1Dignity || 'NEUTRAL',
    house: astro?.house || str?.house,
  };
}
