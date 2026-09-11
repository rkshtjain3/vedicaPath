import { virupasToRupas } from '../units/shadbala-units.js';
/**
 * Calculates Yuddha Bala (Planetary War Strength) according to BPHS Chapter 27.
 *
 * Rules:
 * - Planetary War occurs only between non-luminary planets (Mars, Mercury, Jupiter, Venus, Saturn)
 *   when their mutual longitudinal separation is less than 1.0°.
 * - If not in planetary war, Yuddha Bala is 0.0 Virupas.
 */
export function calculateYuddhaBala(planet, planetLongitude, allPlanets) {
    const isTaraGraha = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(planet);
    let virupas = 0;
    const evidence = [];
    if (!isTaraGraha) {
        evidence.push(`Sun and Moon do not participate in Planetary War (Graha Yuddha): 0 Virupas`);
    }
    else {
        let opponent = null;
        for (const other of allPlanets) {
            if (other.planet !== planet && ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(other.planet)) {
                let diff = Math.abs(planetLongitude - other.longitude);
                if (diff > 180)
                    diff = 360 - diff;
                if (diff <= 1.0) {
                    opponent = { planet: other.planet, diff };
                    break;
                }
            }
        }
        if (opponent) {
            // In war: victor determined by brilliance/order (Venus > Jupiter > Mercury > Mars > Saturn)
            const rank = { Venus: 5, Jupiter: 4, Mercury: 3, Mars: 2, Saturn: 1 };
            const isVictor = (rank[planet] || 0) >= (rank[opponent.planet] || 0);
            virupas = isVictor ? 15.0 : -15.0;
            evidence.push(`Planetary War with ${opponent.planet} (Separation: ${opponent.diff.toFixed(4)}°): ${isVictor ? 'Victor (+15 Virupas)' : 'Vanquished (-15 Virupas)'}`);
        }
        else {
            evidence.push(`No planetary war active within 1.0° orb: 0.00 Virupas`);
        }
    }
    const rupas = virupasToRupas(virupas);
    return {
        name: 'Yuddha Bala',
        subcomponentName: 'YUDDHA_BALA',
        virupas,
        rupas,
        formulaVersion: 'bphs-yuddha-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: { planet, planetLongitude },
        evidence,
    };
}
