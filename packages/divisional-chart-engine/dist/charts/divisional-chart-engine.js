import { RASHIS } from '@vedica/astrology-core';
import { calculatePlanetDignity } from '@vedica/analysis-engine';
import { calculateHoraPosition } from '../calculators/hora-calculator.js';
import { calculateDrekkanaPosition } from '../calculators/drekkana-calculator.js';
import { calculateChaturthamsaPosition } from '../calculators/chaturthamsa-calculator.js';
import { calculateSaptamsaPosition } from '../calculators/saptamsa-calculator.js';
import { calculateNavamsaPosition } from '../calculators/navamsa-calculator.js';
import { calculateDashamsaPosition } from '../calculators/dashamsa-calculator.js';
import { calculateDwadashamsaPosition } from '../calculators/dwadashamsa-calculator.js';
import { calculateShodashamsaPosition } from '../calculators/shodashamsa-calculator.js';
import { calculateVimsamsaPosition } from '../calculators/vimsamsa-calculator.js';
import { calculateChaturvimsamsaPosition } from '../calculators/chaturvimsamsa-calculator.js';
import { calculateSaptavimsamsaPosition } from '../calculators/saptavimsamsa-calculator.js';
import { calculateTrimsamsaPosition } from '../calculators/trimsamsa-calculator.js';
import { calculateKhavedamsaPosition } from '../calculators/khavedamsa-calculator.js';
import { calculateAkshavedamsaPosition } from '../calculators/akshavedamsa-calculator.js';
import { calculateShashtyamsaPosition } from '../calculators/shashtyamsa-calculator.js';
const PLANET_NAMES = [
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
    'Rahu',
    'Ketu',
];
export const DIVISIONAL_PROFILES = {
    D1: {
        type: 'D1',
        division: 1,
        name: 'Rashi',
        sanskritName: 'राशी',
        significance: 'Physical body, general destiny, overt traits',
        significanceHi: 'शारीरिक संरचना, समग्र भाग्य एवं प्रत्यक्ष व्यक्तित्व',
        vimsopakaWeight: { shadvarga: 6, saptavarga: 5, dasavarga: 3, shodashavarga: 3.5 },
        enabled: true,
    },
    D2: {
        type: 'D2',
        division: 2,
        name: 'Hora',
        sanskritName: 'होरा',
        significance: 'Wealth, financial accumulation, liquid assets',
        significanceHi: 'धन, आर्थिक संचय एवं चल संपत्ति',
        vimsopakaWeight: { shadvarga: 2, saptavarga: 2, dasavarga: 1.5, shodashavarga: 1.0 },
        enabled: true,
    },
    D3: {
        type: 'D3',
        division: 3,
        name: 'Drekkana',
        sanskritName: 'द्रेष्काण',
        significance: 'Siblings, courage, vitality, initiative',
        significanceHi: 'भाई-बहन, पराक्रम, साहस एवं आंतरिक शक्ति',
        vimsopakaWeight: { shadvarga: 4, saptavarga: 3, dasavarga: 1.5, shodashavarga: 1.0 },
        enabled: true,
    },
    D4: {
        type: 'D4',
        division: 4,
        name: 'Chaturthamsa',
        sanskritName: 'चतुर्थांश (तुर्यांश)',
        significance: 'Fixed assets, landed property, real estate, domestic fortune',
        significanceHi: 'स्थाई संपत्ति, भूमि-भवन, वाहन एवं पारिवारिक सुख',
        vimsopakaWeight: { shodashavarga: 0.5 },
        enabled: true,
    },
    D7: {
        type: 'D7',
        division: 7,
        name: 'Saptamsa',
        sanskritName: 'सप्तांश',
        significance: 'Progeny, children, grandchildren, creative lineage',
        significanceHi: 'संतान सुख, वंश वृद्धि एवं सृजनात्मक सामर्थ्य',
        vimsopakaWeight: { saptavarga: 2.5, dasavarga: 1.5, shodashavarga: 0.5 },
        enabled: true,
    },
    D9: {
        type: 'D9',
        division: 9,
        name: 'Navamsa',
        sanskritName: 'नवांश',
        significance: 'Spouse, marriage, inner potential, soul destiny, dharma',
        significanceHi: 'विवाह, जीवनसाथी, आत्मिक बल एवं धर्म-भाग्य',
        vimsopakaWeight: { shadvarga: 5, saptavarga: 4.5, dasavarga: 1.5, shodashavarga: 3.0 },
        enabled: true,
    },
    D10: {
        type: 'D10',
        division: 10,
        name: 'Dashamsa',
        sanskritName: 'दशांश',
        significance: 'Career, profession, status, social impact, fame',
        significanceHi: 'कर्म, आजीविका, पद-प्रतिष्ठा एवं सामाजिक प्रभाव',
        vimsopakaWeight: { dasavarga: 1.5, shodashavarga: 0.5 },
        enabled: true,
    },
    D12: {
        type: 'D12',
        division: 12,
        name: 'Dwadashamsa',
        sanskritName: 'द्वादशांश',
        significance: 'Parents, ancestral lineage, heritage, paternal legacy',
        significanceHi: 'माता-पिता, पैतृक संबंध एवं पूर्वजों का आशीर्वाद',
        vimsopakaWeight: { shadvarga: 2, saptavarga: 2, dasavarga: 1.5, shodashavarga: 0.5 },
        enabled: true,
    },
    D16: {
        type: 'D16',
        division: 16,
        name: 'Shodashamsa',
        sanskritName: 'षोडशांश (कलाम)',
        significance: 'Vehicles, conveyances, luxuries, happiness from comforts',
        significanceHi: 'वाहन सुख, भौतिक सुख-सुविधाएं एवं आनंद',
        vimsopakaWeight: { dasavarga: 1.5, shodashavarga: 2.0 },
        enabled: true,
    },
    D20: {
        type: 'D20',
        division: 20,
        name: 'Vimsamsa',
        sanskritName: 'विंशांश',
        significance: 'Spiritual practices, upasana, meditation, devotion, mantra siddhi',
        significanceHi: 'आध्यात्मिक साधना, उपासना, ध्यान एवं मंत्र सिद्धि',
        vimsopakaWeight: { shodashavarga: 0.5 },
        enabled: true,
    },
    D24: {
        type: 'D24',
        division: 24,
        name: 'Chaturvimsamsa',
        sanskritName: 'चतुर्विंशांश (सिद्धांश)',
        significance: 'Higher learning, academic success, intellect, scholarship',
        significanceHi: 'उच्च शिक्षा, बौद्धिक क्षमता, विद्या एवं ज्ञान',
        vimsopakaWeight: { shodashavarga: 0.5 },
        enabled: true,
    },
    D27: {
        type: 'D27',
        division: 27,
        name: 'Saptavimsamsa',
        sanskritName: 'सप्तविंशांश (भंशा/नक्षत्रांश)',
        significance: 'Physical strength, stamina, fortitude, hidden vulnerabilities',
        significanceHi: 'शारीरिक बल, सहनशक्ति, ऊर्जा एवं सूक्ष्म कमजोरियां',
        vimsopakaWeight: { shodashavarga: 0.5 },
        enabled: true,
    },
    D30: {
        type: 'D30',
        division: 30,
        name: 'Trimsamsa',
        sanskritName: 'त्रिंशांश',
        significance: 'Misfortunes, health hazards, obstacles, subconscious shadows',
        significanceHi: 'अनिष्ट, रोग, बाधाएं एवं गुप्त चुनौतियां',
        vimsopakaWeight: { shadvarga: 1, saptavarga: 1, dasavarga: 1.5, shodashavarga: 1.0 },
        enabled: true,
    },
    D40: {
        type: 'D40',
        division: 40,
        name: 'Khavedamsa',
        sanskritName: 'खवेदांश (चत्वारिंशांश)',
        significance: 'Auspicious and inauspicious karmic effects, maternal legacy',
        significanceHi: 'शुभ-अशुभ फल, मातृकुल प्रभाव एवं संचित संस्कार',
        vimsopakaWeight: { shodashavarga: 0.5 },
        enabled: true,
    },
    D45: {
        type: 'D45',
        division: 45,
        name: 'Akshavedamsa',
        sanskritName: 'अक्षवेदांश',
        significance: 'General character, moral purity, ethical fortitude',
        significanceHi: 'चरित्र, आचरण शुद्धि, सत्यनिष्ठा एवं समग्र कल्याण',
        vimsopakaWeight: { shodashavarga: 0.5 },
        enabled: true,
    },
    D60: {
        type: 'D60',
        division: 60,
        name: 'Shashtyamsa',
        sanskritName: 'षष्ट्यंश',
        significance: 'Past-life karma, supreme micro-destiny, root causes of fortune',
        significanceHi: 'पूर्वजन्म संचित कर्म, सूक्ष्म प्रारब्ध एवं भाग्य का मूल स्रोत',
        vimsopakaWeight: { dasavarga: 5, shodashavarga: 4.0 },
        enabled: true,
    },
};
/**
 * Calculates a Divisional Chart from already calculated sidereal D1 planetary longitudes.
 * Reuses D1 sidereal longitudes without re-querying ephemeris.
 */
export function calculateDivisionalChart(birthChart, type = 'D9') {
    const profile = DIVISIONAL_PROFILES[type];
    if (!profile || !profile.enabled) {
        throw new Error(`Unsupported or unenabled divisional chart type: ${type}`);
    }
    const calcPosition = (longitude) => {
        if (type === 'D1') {
            let normalized = longitude % 360;
            if (normalized < 0)
                normalized += 360;
            const signId = Math.floor(normalized / 30) + 1;
            const degInSign = normalized % 30;
            return {
                sign: RASHIS[signId - 1],
                longitudeInSign: degInSign,
                formattedDegree: `${Math.floor(degInSign)}° ${Math.floor((degInSign % 1) * 60)}'`,
                absoluteLongitude: normalized,
                sourceLongitude: longitude,
                divisionNumber: 1,
            };
        }
        if (type === 'D2')
            return calculateHoraPosition(longitude);
        if (type === 'D3')
            return calculateDrekkanaPosition(longitude);
        if (type === 'D4')
            return calculateChaturthamsaPosition(longitude);
        if (type === 'D7')
            return calculateSaptamsaPosition(longitude);
        if (type === 'D9')
            return calculateNavamsaPosition(longitude);
        if (type === 'D10')
            return calculateDashamsaPosition(longitude);
        if (type === 'D12')
            return calculateDwadashamsaPosition(longitude);
        if (type === 'D16')
            return calculateShodashamsaPosition(longitude);
        if (type === 'D20')
            return calculateVimsamsaPosition(longitude);
        if (type === 'D24')
            return calculateChaturvimsamsaPosition(longitude);
        if (type === 'D27')
            return calculateSaptavimsamsaPosition(longitude);
        if (type === 'D30')
            return calculateTrimsamsaPosition(longitude);
        if (type === 'D40')
            return calculateKhavedamsaPosition(longitude);
        if (type === 'D45')
            return calculateAkshavedamsaPosition(longitude);
        if (type === 'D60')
            return calculateShashtyamsaPosition(longitude);
        throw new Error(`No position calculator registered for divisional chart type: ${type}`);
    };
    // 1. Calculate Divisional Ascendant
    const ascendantLongitude = birthChart.ascendant?.totalLongitude ?? birthChart.lagna?.longitude ?? 0;
    const ascendant = calcPosition(ascendantLongitude);
    // 2. Calculate Divisional Planetary Positions
    const planets = {};
    for (const planetPos of birthChart.planets) {
        planets[planetPos.planet] = calcPosition(planetPos.longitude);
    }
    // 3. Whole Sign House Calculation (Divisional Lagna sign = House 1)
    const lagnaSignId = ascendant.sign.id;
    const houses = [];
    for (let h = 1; h <= 12; h++) {
        const signId = ((lagnaSignId + h - 2) % 12) + 1;
        const signDetails = RASHIS[signId - 1];
        const occupants = [];
        for (const name of PLANET_NAMES) {
            if (planets[name] && planets[name].sign.id === signId) {
                occupants.push(name);
            }
        }
        houses.push({
            house: h,
            sign: signDetails,
            occupants,
            lord: signDetails.ruler,
        });
    }
    return {
        type,
        division: profile.division,
        profileVersion: `personal-${type.toLowerCase()}-v1`,
        ascendant,
        planets,
        houses,
    };
}
/**
 * Calculates all 16 Shodashavarga Divisional Charts in a single efficient pass.
 */
export function calculateAllDivisionalCharts(birthChart) {
    const allCharts = {};
    const vargaKeys = Object.keys(DIVISIONAL_PROFILES);
    for (const key of vargaKeys) {
        allCharts[key] = calculateDivisionalChart(birthChart, key);
    }
    return allCharts;
}
/**
 * Analyzes a Divisional Chart by evaluating planetary dignities, house placements, and occupants.
 */
export function analyzeDivisionalChart(divChart, d1Analysis) {
    const planetAnalyses = [];
    const ascendantSignId = divChart.ascendant.sign.id;
    for (const name of PLANET_NAMES) {
        const pos = divChart.planets[name];
        if (!pos)
            continue;
        const house = ((pos.sign.id - ascendantSignId + 12) % 12) + 1;
        const dummyFact = {
            planet: name,
            longitude: pos.absoluteLongitude,
            sign: pos.sign.name,
            degreeInSign: pos.longitudeInSign,
            house,
            nakshatra: '',
            pada: 1,
            retrograde: false,
        };
        const dignityResult = calculatePlanetDignity(dummyFact);
        planetAnalyses.push({
            planet: name,
            position: pos,
            house,
            dignity: dignityResult.primaryDignity,
        });
    }
    return {
        chartType: divChart.type,
        ascendant: divChart.ascendant,
        planets: planetAnalyses,
        houses: divChart.houses,
    };
}
/**
 * Performs machine-readable factual comparison between D1 Rashi and D9 Navamsa.
 * Detects Ascendant & Planetary Vargottama status (D1 Sign === D9 Sign).
 */
export function compareRashiAndNavamsa(birthChart, d9Chart, d1Analysis) {
    const items = [];
    const vargottamaPlanets = [];
    // 1. Ascendant Comparison
    const ascD1Sign = birthChart.lagna.sign;
    const ascD9Sign = d9Chart.ascendant.sign;
    const ascVargottama = ascD1Sign.id === ascD9Sign.id;
    items.push({
        entity: 'Ascendant',
        d1Sign: ascD1Sign,
        d9Sign: ascD9Sign,
        d1House: 1,
        d9House: 1,
        d1Dignity: 'N/A',
        d9Dignity: 'N/A',
        isVargottama: ascVargottama,
        explanation: `D1 Sign: ${ascD1Sign.name}, D9 Sign: ${ascD9Sign.name}. Therefore Ascendant Vargottama = ${ascVargottama ? 'TRUE' : 'FALSE'}.`,
    });
    // 2. Planet Comparisons
    const ascD9SignId = d9Chart.ascendant.sign.id;
    for (const name of PLANET_NAMES) {
        const d1PlanetPos = birthChart.planets.find((p) => p.planet === name);
        const d9Pos = d9Chart.planets[name];
        if (!d1PlanetPos || !d9Pos)
            continue;
        const d1Fact = d1Analysis?.planetFacts.find((f) => f.planet === name);
        const d1DignityFact = d1Analysis?.dignities.find((d) => d.planet === name);
        const d1Sign = d1PlanetPos.sign;
        const d9Sign = d9Pos.sign;
        const d1House = d1Fact ? d1Fact.house : 1;
        const d9House = ((d9Sign.id - ascD9SignId + 12) % 12) + 1;
        const d1DignityStr = d1DignityFact ? d1DignityFact.primaryDignity : 'N/A';
        const dummyD9Fact = {
            planet: name,
            longitude: d9Pos.absoluteLongitude,
            sign: d9Pos.sign.name,
            degreeInSign: d9Pos.longitudeInSign,
            house: d9House,
            nakshatra: '',
            pada: 1,
            retrograde: false,
        };
        const d9DignityResult = calculatePlanetDignity(dummyD9Fact);
        const d9DignityStr = d9DignityResult.primaryDignity;
        const isVargottama = d1Sign.id === d9Sign.id;
        if (isVargottama) {
            vargottamaPlanets.push(name);
        }
        items.push({
            entity: name,
            d1Sign,
            d9Sign,
            d1House,
            d9House,
            d1Dignity: d1DignityStr,
            d9Dignity: d9DignityStr,
            isVargottama,
            explanation: `D1 Sign: ${d1Sign.name}, D9 Sign: ${d9Sign.name}. Therefore Vargottama = ${isVargottama ? 'TRUE' : 'FALSE'}.`,
        });
    }
    return {
        ascendantVargottama: ascVargottama,
        vargottamaPlanets,
        items,
    };
}
/**
 * Performs machine-readable factual comparison between D1 Rashi and D10 Dashamsa.
 */
export function compareRashiAndDashamsa(birthChart, d10Chart, d1Analysis) {
    const items = [];
    const sameSignPlanets = [];
    // 1. Ascendant Comparison
    const ascD1Sign = birthChart.lagna.sign;
    const ascD10Sign = d10Chart.ascendant.sign;
    const ascSameSign = ascD1Sign.id === ascD10Sign.id;
    items.push({
        entity: 'Ascendant',
        d1Sign: ascD1Sign,
        d10Sign: ascD10Sign,
        d1House: 1,
        d10House: 1,
        d1Dignity: 'N/A',
        d10Dignity: 'N/A',
        sameD1D10Sign: ascSameSign,
        explanation: `D1 Sign: ${ascD1Sign.name}, D10 Sign: ${ascD10Sign.name}. Same D1/D10 Sign = ${ascSameSign ? 'TRUE' : 'FALSE'}.`,
    });
    // 2. Planet Comparisons
    const ascD10SignId = d10Chart.ascendant.sign.id;
    for (const name of PLANET_NAMES) {
        const d1PlanetPos = birthChart.planets.find((p) => p.planet === name);
        const d10Pos = d10Chart.planets[name];
        if (!d1PlanetPos || !d10Pos)
            continue;
        const d1Fact = d1Analysis?.planetFacts.find((f) => f.planet === name);
        const d1DignityFact = d1Analysis?.dignities.find((d) => d.planet === name);
        const d1Sign = d1PlanetPos.sign;
        const d10Sign = d10Pos.sign;
        const d1House = d1Fact ? d1Fact.house : 1;
        const d10House = ((d10Sign.id - ascD10SignId + 12) % 12) + 1;
        const d1DignityStr = d1DignityFact ? d1DignityFact.primaryDignity : 'N/A';
        const dummyD10Fact = {
            planet: name,
            longitude: d10Pos.absoluteLongitude,
            sign: d10Pos.sign.name,
            degreeInSign: d10Pos.longitudeInSign,
            house: d10House,
            nakshatra: '',
            pada: 1,
            retrograde: false,
        };
        const d10DignityResult = calculatePlanetDignity(dummyD10Fact);
        const d10DignityStr = d10DignityResult.primaryDignity;
        const sameSign = d1Sign.id === d10Sign.id;
        if (sameSign) {
            sameSignPlanets.push(name);
        }
        items.push({
            entity: name,
            d1Sign,
            d10Sign,
            d1House,
            d10House,
            d1Dignity: d1DignityStr,
            d10Dignity: d10DignityStr,
            sameD1D10Sign: sameSign,
            explanation: `D1 Sign: ${d1Sign.name}, D10 Sign: ${d10Sign.name}. Same D1/D10 Sign = ${sameSign ? 'TRUE' : 'FALSE'}.`,
        });
    }
    return {
        ascendantSameSign: ascSameSign,
        sameSignPlanets,
        items,
    };
}
