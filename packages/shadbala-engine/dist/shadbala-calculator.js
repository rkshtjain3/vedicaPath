import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { PERSONAL_SHADBALA_V1 } from './profiles/shadbala-profile.js';
import { virupasToRupas } from './units/shadbala-units.js';
import { NAISARGIKA_BALA_VIRUPAS, NAISARGIKA_BALA_METADATA } from './constants/naisargika.js';
import { getRequiredStrengthFact } from './constants/required-strength.js';
import { calculateSthanaBala } from './sthana/sthana-bala-calculator.js';
import { calculateDigBala } from './dig/dig-bala.js';
import { calculateCheshtaBala } from './cheshta/cheshta-bala-calculator.js';
import { calculateKaalaBala } from './kaala/kaala-bala-calculator.js';
import { calculateDrikBala } from './drik/drik-bala-calculator.js';
import { calculateSaptavargajaBala } from './sthana/saptavargaja-bala-calculator.js';
import { formatPlanetShadbalaExplanation } from './explainability/explainability.js';
export const SEVEN_PLANETS = [
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
];
export function evaluateShadbalaEngine(context, profile = PERSONAL_SHADBALA_V1) {
    const { chart, analysis } = context;
    const d2Chart = context.d2Chart || calculateDivisionalChart(chart, 'D2');
    const d3Chart = context.d3Chart || calculateDivisionalChart(chart, 'D3');
    const d7Chart = context.d7Chart || calculateDivisionalChart(chart, 'D7');
    const d9Chart = context.d9Chart || calculateDivisionalChart(chart, 'D9');
    const d12Chart = context.d12Chart || calculateDivisionalChart(chart, 'D12');
    const d30Chart = context.d30Chart || calculateDivisionalChart(chart, 'D30');
    const ascendantLongitude = chart.lagna?.longitude ?? 0;
    const planetShadbalaList = [];
    const requiredStrengthMap = {};
    // Prepare 7-planet list for aspect calculations and temporal lords
    const sevenPlanetsArray = SEVEN_PLANETS.map((p) => {
        const pos = chart.planets.find((pl) => pl.planet === p);
        return { planet: p, longitude: pos?.longitude ?? 0 };
    });
    const sunPlanetPos = chart.planets.find((p) => p.planet === 'Sun') || {
        planet: 'Sun',
        longitude: 0,
        degreeInSign: 0,
        speed: 1,
        sign: { id: 1, name: 'Aries', ruler: 'Mars' },
    };
    const sunFact = analysis?.planetFacts?.find((p) => p.planet === 'Sun');
    const sunHouse = sunFact?.house ?? 1;
    const moonPlanetPos = chart.planets.find((p) => p.planet === 'Moon') || {
        planet: 'Moon',
        longitude: 0,
        degreeInSign: 0,
        speed: 13,
        sign: { id: 4, name: 'Cancer', ruler: 'Moon' },
    };
    for (const planet of SEVEN_PLANETS) {
        const planetPos = chart.planets.find((p) => p.planet === planet);
        const planetFact = analysis?.planetFacts?.find((p) => p.planet === planet);
        if (!planetPos || !planetFact) {
            continue;
        }
        const houseNumber = planetFact.house;
        // 1. Saptavargaja Bala (7 Vargas)
        const saptavargaja = calculateSaptavargajaBala({
            planet,
            d1Fact: planetFact,
            analysis,
            d1Chart: chart,
            d2Chart,
            d3Chart,
            d7Chart,
            d9Chart,
            d12Chart,
            d30Chart,
        });
        // 2. Sthana Bala
        const d9Sign = d9Chart.planets[planet]?.sign;
        const sthanaBala = calculateSthanaBala(planet, planetPos.longitude, planetPos.degreeInSign, houseNumber, planetPos.sign, d9Sign, saptavargaja);
        // 3. Dig Bala
        const digBala = calculateDigBala(planet, planetPos.longitude, ascendantLongitude, profile.digBalaMethodology);
        // 4. Naisargika Bala
        const naisargikaVirupas = NAISARGIKA_BALA_VIRUPAS[planet] || 0;
        const naisargikaRupas = virupasToRupas(naisargikaVirupas);
        const naisargikaBala = {
            name: 'Naisargika Bala',
            virupas: naisargikaVirupas,
            rupas: naisargikaRupas,
            formulaVersion: NAISARGIKA_BALA_METADATA.version,
            status: 'BENCHMARK_VALIDATED',
            inputs: { planet, sourceCategory: NAISARGIKA_BALA_METADATA.sourceCategory },
            evidence: [
                `Planet: ${planet}`,
                `Natural Illumination Rank: Fixed Classical Constant`,
                `Naisargika Bala: ${naisargikaVirupas.toFixed(2)} Virupas (${naisargikaRupas.toFixed(2)} Rupas)`,
            ],
        };
        // 5. Cheshta Bala
        const cheshtaBala = calculateCheshtaBala(planet, planetPos, sunPlanetPos.longitude);
        // 6. Kaala Bala
        const kaalaBala = calculateKaalaBala({
            planet,
            planetPos,
            houseNumber,
            sunPlanetPos,
            moonPlanetPos,
            sunHouse,
            birthDate: chart.utcInstant?.isoString || new Date().toISOString(),
            sunSign: sunPlanetPos.sign,
            ayanamshaValue: chart.siderealAyana ?? chart.ayanamshaValue,
            allPlanets: sevenPlanetsArray,
        });
        // 7. Drik Bala
        const drikBala = calculateDrikBala(planet, planetPos.longitude, sevenPlanetsArray);
        // Calculate Comprehensive Totals
        const totalVirupas = sthanaBala.virupas +
            digBala.virupas +
            naisargikaBala.virupas +
            cheshtaBala.virupas +
            kaalaBala.virupas +
            drikBala.virupas;
        const totalRupas = virupasToRupas(totalVirupas);
        const reqStrengthFact = getRequiredStrengthFact(planet, true);
        const shadbalaRatio = reqStrengthFact.requiredVirupas > 0
            ? totalVirupas / reqStrengthFact.requiredVirupas
            : 1;
        const isStrong = totalVirupas >= reqStrengthFact.requiredVirupas;
        const planetShadbala = {
            planet,
            components: {
                sthana: sthanaBala,
                dig: digBala,
                naisargika: naisargikaBala,
                cheshta: cheshtaBala,
                kaala: kaalaBala,
                drik: drikBala,
            },
            totalVirupas,
            totalRupas,
            partialTotalVirupas: totalVirupas,
            partialTotalRupas: totalRupas,
            shadbalaRatio,
            isStrong,
            evidence: [],
        };
        planetShadbala.evidence = formatPlanetShadbalaExplanation(planetShadbala);
        planetShadbalaList.push(planetShadbala);
        requiredStrengthMap[planet] = reqStrengthFact;
    }
    const warnings = [
        'Shadbala calculation is COMPLETE — all 6 classical components (Sthana, Dig, Kaala, Cheshta, Naisargika, Drik) are evaluated according to Brihat Parasara Hora Shastra (BPHS Ch. 27).',
        'Saptavargaja Bala evaluated across all 7 classical Vargas (D1, D2, D3, D7, D9, D12, D30) with Panchadha Maitri.',
        'Kaala Bala includes Nathonata, Paksha, Tribhaga, Varsha/Masa/Dina/Hora, Ayana, and Yuddha Bala.',
        'Drik Bala evaluates all Parashari aspects with continuous angular functions and benefic/malefic polarization.',
    ];
    return {
        profileVersion: profile.version,
        completeness: 'COMPLETE',
        unit: profile.unit,
        virupaPerRupa: profile.virupaPerRupa,
        planets: planetShadbalaList,
        requiredStrength: requiredStrengthMap,
        validation: {
            methodologyStatus: {
                UCHCHA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                OJAYUGMA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                KENDRADI_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                DREKKANA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                DIG_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                NAISARGIKA_BALA: 'BENCHMARK_VALIDATED',
                SAPTAVARGAJA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                CHESHTA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                KAALA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                DRIK_BALA: 'IMPLEMENTED_UNBENCHMARKED',
            },
            benchmarkStatus: 'PARTIALLY_VALIDATED',
            tolerancePolicy: {
                defaultVirupaTolerance: 0.05,
                componentOverrides: {},
            },
        },
        warnings,
    };
}
