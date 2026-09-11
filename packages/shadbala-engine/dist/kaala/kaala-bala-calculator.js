import { virupasToRupas } from '../units/shadbala-units.js';
import { calculateNathonataBala } from './nathonata-bala.js';
import { calculatePakshaBala } from './paksha-bala.js';
import { calculateTribhagaBala } from './tribhaga-bala.js';
import { calculateVarshaMasaDinaHoraBala } from './varsha-masa-dina-hora-bala.js';
import { calculateAyanaBala } from './ayana-bala.js';
import { calculateYuddhaBala } from './yuddha-bala.js';
/**
 * Calculates complete Kaala Bala (Temporal Strength) according to BPHS Chapter 27.
 *
 * Aggregates 6 Subcomponents:
 * 1. Nathonata Bala (Diurnal / Nocturnal)
 * 2. Paksha Bala (Lunar Fortnight)
 * 3. Tribhaga Bala (Three-part Day/Night Division)
 * 4. Varsha-Masa-Dina-Hora Bala (Periodic Temporal Lords)
 * 5. Ayana Bala (Equinoctial / Declination Strength)
 * 6. Yuddha Bala (Planetary War)
 */
export function calculateKaalaBala(input) {
    const { planet, planetPos, sunPlanetPos, moonPlanetPos, sunHouse, birthDate, sunSign, ayanamshaValue, allPlanets, } = input;
    const nathonata = calculateNathonataBala(planet, sunHouse);
    const paksha = calculatePakshaBala(planet, sunPlanetPos.longitude, moonPlanetPos.longitude);
    const tribhaga = calculateTribhagaBala(planet, sunHouse);
    const temporalLords = calculateVarshaMasaDinaHoraBala(planet, birthDate, sunSign.ruler);
    const ayana = calculateAyanaBala(planet, planetPos.longitude, ayanamshaValue);
    const yuddha = calculateYuddhaBala(planet, planetPos.longitude, allPlanets);
    const subcomponents = {
        NATHONNATA_BALA: nathonata,
        PAKSHA_BALA: paksha,
        TRIBHAGA_BALA: tribhaga,
        VARSHA_MASA_DINA_HORA_BALA: temporalLords,
        AYANA_BALA: ayana,
        YUDDHA_BALA: yuddha,
    };
    const totalVirupas = nathonata.virupas +
        paksha.virupas +
        tribhaga.virupas +
        temporalLords.virupas +
        ayana.virupas +
        yuddha.virupas;
    const totalRupas = virupasToRupas(totalVirupas);
    const evidence = [
        `Planet: ${planet}`,
        `Kaala Bala (Temporal Strength) Complete Breakdown:`,
        `- Nathonata Bala: ${nathonata.virupas.toFixed(2)} Virupas`,
        `- Paksha Bala: ${paksha.virupas.toFixed(2)} Virupas`,
        `- Tribhaga Bala: ${tribhaga.virupas.toFixed(2)} Virupas`,
        `- Varsha-Masa-Dina-Hora Bala: ${temporalLords.virupas.toFixed(2)} Virupas`,
        `- Ayana Bala: ${ayana.virupas.toFixed(2)} Virupas`,
        `- Yuddha Bala: ${yuddha.virupas.toFixed(2)} Virupas`,
        `Total Kaala Bala: ${totalVirupas.toFixed(2)} Virupas (${totalRupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Kaala Bala',
        virupas: totalVirupas,
        rupas: totalRupas,
        formulaVersion: 'bphs-kaala-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: {
            planet,
            sunHouse,
            nathonataVirupas: nathonata.virupas,
            pakshaVirupas: paksha.virupas,
            tribhagaVirupas: tribhaga.virupas,
            temporalLordsVirupas: temporalLords.virupas,
            ayanaVirupas: ayana.virupas,
            yuddhaVirupas: yuddha.virupas,
        },
        subcomponents,
        evidence,
    };
}
