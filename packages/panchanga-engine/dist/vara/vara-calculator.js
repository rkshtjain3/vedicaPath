import { VARA_DEFINITIONS } from '../constants/panchanga-constants.js';
export function calculateVara(birthDate) {
    const d = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const dayIndex = isNaN(d.getTime()) ? 0 : d.getUTCDay();
    const def = VARA_DEFINITIONS[dayIndex] || VARA_DEFINITIONS[0];
    const lord = def.lordPlanet || def.lord;
    return {
        dayIndex,
        name: def.name,
        sanskritName: def.sanskritName,
        lord,
        element: 'AGNI',
        guna: def.guna,
        recommendation: def.recommendation,
    };
}
