import { YOGA_DEFINITIONS } from '../constants/panchanga-constants.js';
export function calculateYoga(sunLongitude, moonLongitude) {
    const sum = ((sunLongitude + moonLongitude) % 360 + 360) % 360;
    const yogaArc = 360 / 27; // 13.333333333333334°
    const yogaIndex = Math.min(27, Math.floor(sum / yogaArc) + 1);
    const elapsedDegrees = sum % yogaArc;
    const percentageElapsed = (elapsedDegrees / yogaArc) * 100;
    const def = YOGA_DEFINITIONS[yogaIndex - 1] || YOGA_DEFINITIONS[0];
    return {
        index: yogaIndex,
        name: def.name,
        sanskritName: def.sanskritName,
        isAuspicious: def.isAuspicious,
        deity: def.deity,
        element: 'AKASHA',
        meaning: def.meaning,
        elapsedDegrees,
        percentageElapsed,
    };
}
