import { virupasToRupas } from '../units/shadbala-units.js';
/**
 * Calculates Tribhaga Bala (Three-part Day/Night Division Strength) according to BPHS Chapter 27.
 *
 * Rules:
 * - Day Portions:
 *   1st part: Mercury (60 Virupas)
 *   2nd part: Sun (60 Virupas)
 *   3rd part: Saturn (60 Virupas)
 * - Night Portions:
 *   1st part: Moon (60 Virupas)
 *   2nd part: Venus (60 Virupas)
 *   3rd part: Mars (60 Virupas)
 * - Jupiter always receives 60 Virupas.
 */
export function calculateTribhagaBala(planet, sunHouse, decimalHourOfDay = 12) {
    let virupas = 0;
    // Jupiter always gets 60 Virupas in Tribhaga Bala
    if (planet === 'Jupiter') {
        virupas = 60;
    }
    else {
        // Map hour to 6 parts (06:00 to 18:00 is Day, 18:00 to 06:00 is Night)
        const isDay = sunHouse >= 7 && sunHouse <= 12;
        if (isDay) {
            if (sunHouse === 12 || sunHouse === 11) {
                // Morning (1st third) -> Mercury
                if (planet === 'Mercury')
                    virupas = 60;
            }
            else if (sunHouse === 10 || sunHouse === 9) {
                // Midday (2nd third) -> Sun
                if (planet === 'Sun')
                    virupas = 60;
            }
            else {
                // Afternoon (3rd third) -> Saturn
                if (planet === 'Saturn')
                    virupas = 60;
            }
        }
        else {
            // Night
            if (sunHouse === 6 || sunHouse === 5) {
                // First third of night -> Moon
                if (planet === 'Moon')
                    virupas = 60;
            }
            else if (sunHouse === 4 || sunHouse === 3) {
                // Midnight third -> Venus
                if (planet === 'Venus')
                    virupas = 60;
            }
            else {
                // Pre-dawn third -> Mars
                if (planet === 'Mars')
                    virupas = 60;
            }
        }
    }
    const rupas = virupasToRupas(virupas);
    const evidence = [
        `Tribhaga Rule for ${planet}: ${virupas > 0 ? 'Active Planetary Division Ruler' : 'Inactive in this portion'}`,
        `Tribhaga Bala: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Tribhaga Bala',
        subcomponentName: 'TRIBHAGA_BALA',
        virupas,
        rupas,
        formulaVersion: 'bphs-tribhaga-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: { planet, sunHouse, decimalHourOfDay },
        evidence,
    };
}
