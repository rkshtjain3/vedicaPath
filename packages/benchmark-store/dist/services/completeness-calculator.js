export function calculateReferenceCompleteness(referenceValues) {
    if (!referenceValues || Object.keys(referenceValues).length === 0) {
        return {
            ascendant: 0,
            planets: 0,
            nakshatras: 0,
            dasha: 0,
            divisionalCharts: 0,
            overallPercent: 0,
            status: 'NOT_AVAILABLE',
        };
    }
    const astRef = referenceValues.astrology || referenceValues;
    // 1. Ascendant (Longitude + Sign) -> 2 items
    let ascScore = 0;
    if (astRef.ascendantLongitude !== undefined || astRef.lagnaLongitude !== undefined)
        ascScore += 50;
    if (astRef.ascendantSign !== undefined || astRef.lagnaSign !== undefined)
        ascScore += 50;
    // 2. Planets (9 planets longitudes + signs) -> 18 items
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    let planetScore = 0;
    let planetTotalItems = planetNames.length * 2;
    let planetEntered = 0;
    for (const p of planetNames) {
        const lng = astRef.planetaryLongitudes?.[p] ?? astRef[p.toLowerCase()]?.longitude;
        const sign = astRef.planetarySigns?.[p] ?? astRef[p.toLowerCase()]?.sign;
        if (lng !== undefined)
            planetEntered++;
        if (sign !== undefined)
            planetEntered++;
    }
    planetScore = Math.round((planetEntered / planetTotalItems) * 100);
    // 3. Nakshatras & Padas (9 planets) -> 18 items
    const nakRef = referenceValues.nakshatras || astRef.nakshatras || {};
    const padaRef = referenceValues.padas || astRef.padas || {};
    let nakEntered = 0;
    for (const p of planetNames) {
        if (nakRef[p] !== undefined)
            nakEntered++;
        if (padaRef[p] !== undefined)
            nakEntered++;
    }
    const nakScore = Math.round((nakEntered / (planetNames.length * 2)) * 100);
    // 4. Dasha (birthNakshatra, starting Lord, balanceAtBirth) -> 3 items
    const dashaRef = referenceValues.dasha || {};
    let dashaEntered = 0;
    if (dashaRef.birthNakshatra !== undefined)
        dashaEntered++;
    if (dashaRef.dashaStartingLord !== undefined || dashaRef.mahadashaAtBirth !== undefined)
        dashaEntered++;
    if (dashaRef.balanceYearsAtBirth !== undefined || dashaRef.balanceAtBirthYears !== undefined)
        dashaEntered++;
    const dashaScore = Math.round((dashaEntered / 3) * 100);
    // 5. Divisional Charts (D1-D30 signs for 9 planets) -> 8 charts * 9 planets = 72 items
    const divRef = referenceValues.divisionalCharts || {};
    const divCodes = ['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12', 'D30'];
    let divEntered = 0;
    let divTotal = divCodes.length * planetNames.length;
    for (const code of divCodes) {
        const chartRef = divRef[code];
        if (chartRef) {
            for (const p of planetNames) {
                if (typeof chartRef[p] === 'string' || chartRef[p]?.sign !== undefined) {
                    divEntered++;
                }
            }
        }
    }
    const divScore = Math.round((divEntered / divTotal) * 100);
    // Weighted overall calculation
    // Ascendant: 10%, Planets: 35%, Nakshatras: 15%, Dasha: 15%, Divisional: 25%
    const overallPercent = Math.round(ascScore * 0.10 +
        planetScore * 0.35 +
        nakScore * 0.15 +
        dashaScore * 0.15 +
        divScore * 0.25);
    let status = 'NOT_AVAILABLE';
    if (overallPercent === 100) {
        status = 'COMPLETE';
    }
    else if (overallPercent > 0) {
        status = 'PARTIAL';
    }
    return {
        ascendant: ascScore,
        planets: planetScore,
        nakshatras: nakScore,
        dasha: dashaScore,
        divisionalCharts: divScore,
        overallPercent,
        status,
    };
}
//# sourceMappingURL=completeness-calculator.js.map