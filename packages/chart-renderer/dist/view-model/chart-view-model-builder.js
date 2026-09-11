import { getPlanetAbbreviation, getRashiIdByName, getRashiNameById, RASHI_LORDS, formatDegree, } from '../labels/planet-abbreviations.js';
export function buildChartViewModelFromD1(chartData, style = 'NORTH_INDIAN') {
    if (!chartData || !chartData.lagna) {
        return createFallbackViewModel('D1', 'D1 Rashi Chart', style);
    }
    const ascSignName = chartData.lagna.sign?.name || 'Aries';
    const ascSignId = chartData.lagna.sign?.id || getRashiIdByName(ascSignName);
    const ascLongitude = chartData.lagna.longitude ?? 0;
    // Prepare 12 Houses
    const houses = [];
    for (let h = 1; h <= 12; h++) {
        const signId = ((ascSignId - 1 + (h - 1)) % 12) + 1;
        const signName = getRashiNameById(signId);
        houses.push({
            house: h,
            sign: signName,
            signId,
            lord: RASHI_LORDS[signName] || '',
            planets: [],
        });
    }
    const planets = [];
    if (Array.isArray(chartData.planets)) {
        for (const p of chartData.planets) {
            const pSignName = p.sign?.name || getRashiNameById(p.sign?.id || 1);
            const pSignId = p.sign?.id || getRashiIdByName(pSignName);
            // House number (1-12) relative to Ascendant
            let houseNo = p.house;
            if (!houseNo || houseNo < 1 || houseNo > 12) {
                houseNo = ((pSignId - ascSignId + 12) % 12) + 1;
            }
            const cp = {
                planet: p.planet,
                abbreviation: getPlanetAbbreviation(p.planet),
                longitude: p.longitude,
                formattedDegree: formatDegree(p.longitude % 30),
                sign: pSignName,
                signId: pSignId,
                house: houseNo,
                retrograde: p.isRetrograde ?? p.retrograde ?? false,
                combust: p.isCombust ?? p.combust ?? false,
                nakshatra: p.nakshatra
                    ? {
                        name: p.nakshatra.name,
                        pada: p.nakshatra.pada,
                    }
                    : undefined,
                dignity: p.dignity,
            };
            planets.push(cp);
            // Add to corresponding house
            const targetHouse = houses.find((h) => h.house === houseNo);
            if (targetHouse) {
                targetHouse.planets.push(cp);
            }
        }
    }
    return {
        chartType: 'D1',
        title: 'D1 Rashi Chart',
        ascendantSign: ascSignName,
        ascendantSignId: ascSignId,
        ascendantLongitude: ascLongitude,
        formattedAscendantDegree: formatDegree(ascLongitude % 30),
        houses,
        planets,
        style,
    };
}
export function buildChartViewModelFromDivisional(divChartData, chartType = 'D9', style = 'NORTH_INDIAN') {
    if (!divChartData || !divChartData.ascendant) {
        return createFallbackViewModel(chartType, `${chartType} Chart`, style);
    }
    const ascObj = divChartData.ascendant;
    const ascSignName = ascObj.sign?.name || 'Aries';
    const ascSignId = ascObj.sign?.id || getRashiIdByName(ascSignName);
    const ascLongitude = ascObj.absoluteLongitude ?? 0;
    const titleMap = {
        D1: 'D1 Rashi Chart (Physical Body & Self)',
        D2: 'D2 Hora Chart (Wealth & Resources)',
        D3: 'D3 Drekkana Chart (Siblings & Courage)',
        D4: 'D4 Chaturthamsa Chart (Property & Home)',
        D7: 'D7 Saptamsa Chart (Children & Creative Progeny)',
        D9: 'D9 Navamsa Chart (Dharma & Soul Destiny)',
        D10: 'D10 Dashamsa Chart (Career & Profession)',
        D12: 'D12 Dwadasamsa Chart (Parents & Ancestry)',
        D16: 'D16 Shodashamsa Chart (Vehicles & Material Joy)',
        D20: 'D20 Vimsamsa Chart (Spiritual Sadhana & Bhakti)',
        D24: 'D24 Chaturvimsamsa Chart (Higher Intellect & Learning)',
        D27: 'D27 Saptavimsamsa Chart (Subconscious Strengths & Nakshatras)',
        D30: 'D30 Trimsamsa Chart (Karmic Afflictions & Evils)',
        D40: 'D40 Khavedamsa Chart (Auspicious Effects)',
        D45: 'D45 Akshavedamsa Chart (Moral Character & Integrity)',
        D60: 'D60 Shashtyamsa Chart (Past Karma & Micro-Destiny)',
    };
    const houses = [];
    for (let h = 1; h <= 12; h++) {
        const signId = ((ascSignId - 1 + (h - 1)) % 12) + 1;
        const signName = getRashiNameById(signId);
        houses.push({
            house: h,
            sign: signName,
            signId,
            lord: RASHI_LORDS[signName] || '',
            planets: [],
        });
    }
    const planets = [];
    if (divChartData.planets && typeof divChartData.planets === 'object') {
        const planetEntries = Array.isArray(divChartData.planets)
            ? divChartData.planets
            : Object.entries(divChartData.planets).map(([name, pos]) => ({
                planet: name,
                ...pos,
            }));
        for (const p of planetEntries) {
            const pName = p.planet;
            const pSignName = p.sign?.name || getRashiNameById(p.sign?.id || 1);
            const pSignId = p.sign?.id || getRashiIdByName(pSignName);
            const houseNo = ((pSignId - ascSignId + 12) % 12) + 1;
            const cp = {
                planet: pName,
                abbreviation: getPlanetAbbreviation(pName),
                longitude: p.absoluteLongitude,
                formattedDegree: p.formattedDegree || formatDegree((p.absoluteLongitude || 0) % 30),
                sign: pSignName,
                signId: pSignId,
                house: houseNo,
                retrograde: p.retrograde ?? false,
                combust: p.combust ?? false,
                dignity: p.dignity,
            };
            planets.push(cp);
            const targetHouse = houses.find((h) => h.house === houseNo);
            if (targetHouse) {
                targetHouse.planets.push(cp);
            }
        }
    }
    return {
        chartType,
        title: titleMap[chartType] || `${chartType} Divisional Chart`,
        ascendantSign: ascSignName,
        ascendantSignId: ascSignId,
        ascendantLongitude: ascLongitude,
        formattedAscendantDegree: formatDegree(ascLongitude % 30),
        houses,
        planets,
        style,
    };
}
export function buildChartViewModel(calculationResult, chartType = 'D1', style = 'NORTH_INDIAN', options) {
    if (!calculationResult) {
        return createFallbackViewModel(chartType, `${chartType} Chart`, style);
    }
    const rootData = calculationResult?.data || calculationResult || {};
    const astData = rootData.astrology || rootData;
    let baseViewModel;
    if (chartType === 'D1') {
        baseViewModel = buildChartViewModelFromD1(astData, style);
    }
    else {
        const shodashavarga = rootData.shodashavarga || rootData.divisionalCharts || rootData;
        const targetKey = chartType.toUpperCase();
        const divData = shodashavarga[targetKey] || shodashavarga[chartType.toLowerCase()] || shodashavarga[chartType];
        if (divData) {
            baseViewModel = buildChartViewModelFromDivisional(divData, chartType, style);
        }
        else {
            baseViewModel = buildChartViewModelFromD1(astData, style);
        }
    }
    // If Transit Overlay is requested and transit data is present
    if (options?.showTransitOverlay && options?.transitData) {
        const transitPlanets = Array.isArray(options.transitData)
            ? options.transitData
            : options.transitData?.transitPlanets || options.transitData?.planets || [];
        if (Array.isArray(transitPlanets) && transitPlanets.length > 0) {
            const ascSignId = baseViewModel.ascendantSignId;
            for (const tp of transitPlanets) {
                const tpSignName = tp.sign?.name || getRashiNameById(tp.sign?.id || 1);
                const tpSignId = tp.sign?.id || getRashiIdByName(tpSignName);
                const houseNo = ((tpSignId - ascSignId + 12) % 12) + 1;
                const transitChartPlanet = {
                    planet: `T-${tp.planet}`,
                    abbreviation: `T-${getPlanetAbbreviation(tp.planet)}`,
                    longitude: tp.longitude,
                    formattedDegree: formatDegree(tp.longitude % 30),
                    sign: tpSignName,
                    signId: tpSignId,
                    house: houseNo,
                    retrograde: tp.isRetrograde ?? tp.retrograde ?? false,
                    isTransit: true,
                };
                baseViewModel.planets.push(transitChartPlanet);
                const targetHouse = baseViewModel.houses.find((h) => h.house === houseNo);
                if (targetHouse) {
                    targetHouse.planets.push(transitChartPlanet);
                }
            }
        }
    }
    return baseViewModel;
}
function createFallbackViewModel(chartType, title, style) {
    const houses = [];
    for (let h = 1; h <= 12; h++) {
        const signName = getRashiNameById(h);
        houses.push({
            house: h,
            sign: signName,
            signId: h,
            lord: RASHI_LORDS[signName] || '',
            planets: [],
        });
    }
    return {
        chartType,
        title,
        ascendantSign: 'Aries',
        ascendantSignId: 1,
        houses,
        planets: [],
        style,
    };
}
