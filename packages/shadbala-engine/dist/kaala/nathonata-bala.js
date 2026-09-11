import { virupasToRupas } from '../units/shadbala-units.js';
/**
 * Calculates Nathonata Bala (Diurnal / Nocturnal Strength) according to BPHS Chapter 27.
 *
 * Rules:
 * - Day Birth (Sun in Houses 7-12 / above horizon):
 *   Sun, Jupiter, Venus get 60 Virupas. Moon, Mars, Saturn get 0 Virupas. Mercury gets 60 Virupas.
 * - Night Birth (Sun in Houses 1-6 / below horizon):
 *   Moon, Mars, Saturn get 60 Virupas. Sun, Jupiter, Venus get 0 Virupas. Mercury gets 60 Virupas.
 */
export function calculateNathonataBala(planet, sunHouse) {
    const isDayBirth = sunHouse >= 7 && sunHouse <= 12;
    let virupas = 0;
    if (planet === 'Mercury') {
        virupas = 60; // Mercury is always powerful day and night
    }
    else if (isDayBirth) {
        if (planet === 'Sun' || planet === 'Jupiter' || planet === 'Venus') {
            virupas = 60;
        }
        else {
            virupas = 0;
        }
    }
    else {
        // Night birth
        if (planet === 'Moon' || planet === 'Mars' || planet === 'Saturn') {
            virupas = 60;
        }
        else {
            virupas = 0;
        }
    }
    const rupas = virupasToRupas(virupas);
    const evidence = [
        `Nativity: ${isDayBirth ? 'Day Birth (Diva)' : 'Night Birth (Ratri)'} (Sun in House ${sunHouse})`,
        `Nathonata Bala: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Nathonata Bala',
        subcomponentName: 'NATHONNATA_BALA',
        virupas,
        rupas,
        formulaVersion: 'bphs-nathonata-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: { planet, sunHouse, isDayBirth },
        evidence,
    };
}
