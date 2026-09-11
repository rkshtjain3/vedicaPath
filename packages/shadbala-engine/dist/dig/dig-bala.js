import { virupasToRupas, angularDistance180 } from '../units/shadbala-units.js';
/**
 * Classical Directional Strength (Dig Bala) Planetary Points
 *
 * Mercury & Jupiter: Strongest in East (House 1 / Lagna) -> Zero point in West (House 7 / Descendant)
 * Sun & Mars: Strongest in South (House 10 / MC) -> Zero point in North (House 4 / IC)
 * Saturn: Strongest in West (House 7 / Descendant) -> Zero point in East (House 1 / Lagna)
 * Moon & Venus: Strongest in North (House 4 / IC) -> Zero point in South (House 10 / MC)
 *
 * Source: BPHS Dig Bala Adhyaya.
 */
export const DIG_BALA_POINTS = {
    Mercury: {
        planet: 'Mercury',
        strongestHouse: 1,
        strongestDirection: 'EAST',
        zeroHouse: 7,
        zeroLongitudeOffsetFromAscendant: 180, // House 7 cusp is Lagna + 180°
    },
    Jupiter: {
        planet: 'Jupiter',
        strongestHouse: 1,
        strongestDirection: 'EAST',
        zeroHouse: 7,
        zeroLongitudeOffsetFromAscendant: 180,
    },
    Sun: {
        planet: 'Sun',
        strongestHouse: 10,
        strongestDirection: 'SOUTH',
        zeroHouse: 4,
        zeroLongitudeOffsetFromAscendant: 90, // House 4 cusp is Lagna + 90°
    },
    Mars: {
        planet: 'Mars',
        strongestHouse: 10,
        strongestDirection: 'SOUTH',
        zeroHouse: 4,
        zeroLongitudeOffsetFromAscendant: 90,
    },
    Saturn: {
        planet: 'Saturn',
        strongestHouse: 7,
        strongestDirection: 'WEST',
        zeroHouse: 1,
        zeroLongitudeOffsetFromAscendant: 0, // House 1 cusp is Lagna (0°)
    },
    Moon: {
        planet: 'Moon',
        strongestHouse: 4,
        strongestDirection: 'NORTH',
        zeroHouse: 10,
        zeroLongitudeOffsetFromAscendant: 270, // House 10 cusp is Lagna + 270°
    },
    Venus: {
        planet: 'Venus',
        strongestHouse: 4,
        strongestDirection: 'NORTH',
        zeroHouse: 10,
        zeroLongitudeOffsetFromAscendant: 270,
    },
    Rahu: {
        planet: 'Rahu',
        strongestHouse: 1,
        strongestDirection: 'EAST',
        zeroHouse: 7,
        zeroLongitudeOffsetFromAscendant: 180,
    },
    Ketu: {
        planet: 'Ketu',
        strongestHouse: 7,
        strongestDirection: 'WEST',
        zeroHouse: 1,
        zeroLongitudeOffsetFromAscendant: 0,
    },
};
/**
 * Calculates Dig Bala (Directional Strength).
 *
 * Methodology: `EXACT_ANGULAR`
 * 1. Determine the exact zero-strength longitude for the planet relative to Ascendant longitude.
 *    - Mercury / Jupiter: Zero point = Ascendant + 180° (House 7 Cusp)
 *    - Sun / Mars: Zero point = Ascendant + 90° (House 4 Cusp)
 *    - Saturn: Zero point = Ascendant + 0° (House 1 Cusp)
 *    - Moon / Venus: Zero point = Ascendant + 270° (House 10 Cusp)
 * 2. Calculate angular distance between planet's longitude and its zero-strength longitude.
 * 3. Dig Bala Virupas = angular_distance / 3.
 *    Max Dig Bala = 180° / 3 = 60 Virupas.
 */
export function calculateDigBala(planet, planetLongitude, ascendantLongitude, methodology = 'EXACT_ANGULAR') {
    const digPoint = DIG_BALA_POINTS[planet];
    if (!digPoint || planet === 'Rahu' || planet === 'Ketu') {
        return {
            name: 'Dig Bala',
            virupas: 0,
            rupas: 0,
            formulaVersion: 'bphs-dig-bala-v1',
            status: 'IMPLEMENTED_UNBENCHMARKED',
            inputs: { planet, planetLongitude, ascendantLongitude, methodology },
            evidence: [`${planet} does not receive standard Dig Bala`],
        };
    }
    // Calculate zero longitude
    const zeroLongitude = (ascendantLongitude + digPoint.zeroLongitudeOffsetFromAscendant) % 360;
    const angularDistFromZero = angularDistance180(planetLongitude, zeroLongitude);
    const virupas = angularDistFromZero / 3;
    const rupas = virupasToRupas(virupas);
    const evidence = [
        `Planet: ${planet}`,
        `Strongest Direction: ${digPoint.strongestDirection} (House ${digPoint.strongestHouse})`,
        `Zero Dig Bala Point: House ${digPoint.zeroHouse} (${zeroLongitude.toFixed(2)}°)`,
        `Current Longitude: ${planetLongitude.toFixed(2)}°`,
        `Angular Distance from Zero Point: ${angularDistFromZero.toFixed(2)}°`,
        `Methodology: ${methodology}`,
        `Formula: distance / 3 = ${angularDistFromZero.toFixed(2)}° / 3`,
        `Result: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Dig Bala',
        virupas,
        rupas,
        formulaVersion: 'bphs-dig-bala-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: {
            planet,
            planetLongitude,
            ascendantLongitude,
            strongestHouse: digPoint.strongestHouse,
            strongestDirection: digPoint.strongestDirection,
            zeroHouse: digPoint.zeroHouse,
            zeroLongitude,
            angularDistFromZero,
            methodology,
        },
        evidence,
    };
}
