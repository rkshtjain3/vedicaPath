import { TITHI_DEFINITIONS } from '../constants/panchanga-constants.js';
export function calculateTithi(sunLongitude, moonLongitude) {
    const diff = ((moonLongitude - sunLongitude + 360) % 360);
    const tithiIndex = Math.min(30, Math.floor(diff / 12) + 1);
    const elapsedDegrees = diff % 12;
    const percentageElapsed = (elapsedDegrees / 12) * 100;
    const paksha = tithiIndex <= 15 ? 'SHUKLA' : 'KRISHNA';
    const numberInPaksha = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
    const def = TITHI_DEFINITIONS[tithiIndex - 1] || TITHI_DEFINITIONS[0];
    return {
        index: tithiIndex,
        numberInPaksha,
        name: def.name,
        sanskritName: def.sanskritName,
        paksha,
        pakshaName: paksha === 'SHUKLA' ? 'Shukla Paksha (Bright Fortnight)' : 'Krishna Paksha (Dark Fortnight)',
        deity: def.deity,
        element: 'JALA',
        nature: def.nature,
        elapsedDegrees,
        percentageElapsed,
        rulingPlanet: def.rulingPlanet,
        auspiciousness: def.auspiciousness,
    };
}
