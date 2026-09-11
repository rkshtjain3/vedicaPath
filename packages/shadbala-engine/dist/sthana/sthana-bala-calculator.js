import { virupasToRupas } from '../units/shadbala-units.js';
import { calculateUchchaBala } from './uchcha-bala.js';
import { calculateOjayugmaBala } from './ojayugma-bala.js';
import { calculateKendradiBala } from './kendradi-bala.js';
import { calculateDrekkanaBala } from './drekkana-bala.js';
export function calculateSthanaBala(planet, longitude, degreeInSign, house, d1Sign, d9Sign, saptavarga) {
    const uchcha = calculateUchchaBala(planet, longitude);
    const ojayugma = calculateOjayugmaBala(planet, d1Sign, d9Sign);
    const kendradi = calculateKendradiBala(planet, house);
    const drekkana = calculateDrekkanaBala(planet, degreeInSign);
    const totalVirupas = uchcha.virupas + saptavarga.virupas + ojayugma.virupas + kendradi.virupas + drekkana.virupas;
    const totalRupas = virupasToRupas(totalVirupas);
    const evidence = [
        `=== Sthana Bala Breakdown for ${planet} ===`,
        `1. Uchcha Bala: ${uchcha.virupas.toFixed(2)} Virupas`,
        `2. Saptavargaja Bala: ${saptavarga.virupas.toFixed(2)} Virupas (${saptavarga.status})`,
        `3. Ojayugma Bala: ${ojayugma.virupas.toFixed(2)} Virupas`,
        `4. Kendradi Bala: ${kendradi.virupas.toFixed(2)} Virupas`,
        `5. Drekkana Bala: ${drekkana.virupas.toFixed(2)} Virupas`,
        `Total Sthana Bala Virupas: ${totalVirupas.toFixed(2)} Virupas (${totalRupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Sthana Bala',
        virupas: totalVirupas,
        rupas: totalRupas,
        formulaVersion: 'bphs-sthana-bala-v1',
        status: saptavarga.status === 'PARTIAL' ? 'PARTIAL' : 'IMPLEMENTED_UNBENCHMARKED',
        inputs: {
            planet,
            longitude,
            degreeInSign,
            house,
            d1SignId: d1Sign.id,
            d9SignId: d9Sign?.id,
        },
        evidence,
        subcomponents: {
            UCHCHA_BALA: uchcha,
            SAPTAVARGAJA_BALA: saptavarga,
            OJAYUGMA_BALA: ojayugma,
            KENDRADI_BALA: kendradi,
            DREKKANA_BALA: drekkana,
        },
        saptavargaStatus: {
            status: saptavarga.status,
            supportedVargas: ['D1', 'D2', 'D3', 'D7', 'D9', 'D12', 'D30'],
            unsupportedVargas: [],
        },
    };
}
