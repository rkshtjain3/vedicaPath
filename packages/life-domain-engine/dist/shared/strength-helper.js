/**
 * Safe extractor for planetary strength information across shadbala, strengthAnalysis, and astrology facts.
 */
export function getPlanetStrengthInfo(planet, engineData) {
    const shad = engineData.shadbala?.planets?.find((p) => p.planet === planet);
    const str = engineData.strengthAnalysis?.planets?.find((p) => p.planet === planet);
    const fact = engineData.analysis?.planetFacts?.find((f) => f.planet === planet);
    const astro = engineData.astrology?.planets?.find((p) => p.planet === planet);
    const lagnaSignId = engineData.astrology?.ascendant?.sign?.id || engineData.astrology?.lagna?.sign?.id || 1;
    const ratio = typeof shad?.shadbalaRatio === 'number' ? shad.shadbalaRatio : (typeof shad?.ratio === 'number' ? shad.ratio : undefined);
    const rupas = typeof shad?.totalRupas === 'number' ? shad.totalRupas : (typeof shad?.totalRupa === 'number' ? shad.totalRupa : (typeof shad?.partialTotalRupas === 'number' ? shad.partialTotalRupas : undefined));
    const dignity = fact?.dignity || str?.d1Dignity || 'NEUTRAL';
    const signId = typeof astro?.sign === 'object' ? astro.sign?.id : 0;
    const computedHouse = signId ? ((signId - lagnaSignId + 12) % 12) + 1 : 1;
    const house = fact?.house || str?.house || computedHouse;
    const sign = fact?.sign?.name || astro?.sign?.name || 'N/A';
    const score = str?.score || 50;
    const isStrong = shad?.isStrong === true ||
        (typeof ratio === 'number' && ratio >= 1.0) ||
        str?.overallStrength === 'STRONG' ||
        str?.overallStrength === 'VERY_STRONG' ||
        str?.overallStrength === 'EXCELLENT' ||
        ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'].includes(dignity.toUpperCase());
    const isWeak = dignity.toUpperCase() === 'DEBILITATED' ||
        str?.overallStrength === 'WEAK' ||
        str?.overallStrength === 'VERY_WEAK' ||
        (typeof ratio === 'number' && ratio < 0.95);
    return {
        planet,
        isStrong,
        isWeak,
        rupas,
        ratio,
        overallStrength: str?.overallStrength,
        dignity,
        house,
        sign,
        score,
    };
}
//# sourceMappingURL=strength-helper.js.map