import { virupasToRupas } from '../units/shadbala-units.js';
const WEEKDAY_LORDS = [
    'Sun', // Sunday (0)
    'Moon', // Monday (1)
    'Mars', // Tuesday (2)
    'Mercury', // Wednesday (3)
    'Jupiter', // Thursday (4)
    'Venus', // Friday (5)
    'Saturn', // Saturday (6)
];
const CHALDEAN_HORA_ORDER = [
    'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
];
/**
 * Calculates Lord of Year, Month, Day, and Hour Strengths (BPHS Chapter 27):
 * - Varsha Lord (Year Lord): 15 Virupas
 * - Masa Lord (Month Lord): 30 Virupas
 * - Dina Lord (Weekday Lord): 45 Virupas
 * - Hora Lord (Hour Lord): 60 Virupas
 */
export function calculateVarshaMasaDinaHoraBala(planet, birthDate, sunSignLord) {
    const d = new Date(birthDate);
    const dayOfWeek = isNaN(d.getDay()) ? 1 : d.getDay();
    const hour = isNaN(d.getUTCHours()) ? 12 : d.getUTCHours();
    const dinaLord = WEEKDAY_LORDS[dayOfWeek];
    const masaLord = sunSignLord;
    const varshaLord = WEEKDAY_LORDS[(d.getUTCFullYear() + dayOfWeek) % 7];
    // Hora lord calculation from sunrise (approx hour 6)
    const horaIndex = (CHALDEAN_HORA_ORDER.indexOf(dinaLord) + ((hour - 6 + 24) % 24)) % 7;
    const horaLord = CHALDEAN_HORA_ORDER[horaIndex];
    let virupas = 0;
    const evidence = [];
    if (planet === horaLord) {
        virupas += 60;
        evidence.push(`Lord of Hora (Planetary Hour: ${horaLord}): +60 Virupas`);
    }
    if (planet === dinaLord) {
        virupas += 45;
        evidence.push(`Lord of Day (Vara: ${dinaLord}): +45 Virupas`);
    }
    if (planet === masaLord) {
        virupas += 30;
        evidence.push(`Lord of Month (Masa: ${masaLord}): +30 Virupas`);
    }
    if (planet === varshaLord) {
        virupas += 15;
        evidence.push(`Lord of Year (Varsha: ${varshaLord}): +15 Virupas`);
    }
    if (virupas === 0) {
        evidence.push(`No temporal rulership (Varsha/Masa/Dina/Hora) active for ${planet}: 0 Virupas`);
    }
    const rupas = virupasToRupas(virupas);
    evidence.push(`Total Periodic Rulership Bala: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`);
    return {
        name: 'Varsha-Masa-Dina-Hora Bala',
        subcomponentName: 'VARSHA_MASA_DINA_HORA_BALA',
        virupas,
        rupas,
        formulaVersion: 'bphs-temporal-lords-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: { planet, dayOfWeek, dinaLord, masaLord, varshaLord, horaLord },
        evidence,
    };
}
