import { virupasToRupas } from '../units/shadbala-units.js';
/**
 * Calculates Paksha Bala (Fortnight / Lunar Phase Strength) according to BPHS Chapter 27.
 *
 * Formula:
 * - Elongation: θ = (Moon Longitude - Sun Longitude + 360) % 360
 * - Benefic Arc = (θ <= 180 ? θ : (360 - θ)) / 3  (Range [0, 60] Virupas)
 * - Benefics (Jupiter, Venus, Moon, unafflicted Mercury): Virupas = Benefic Arc
 * - Malefics (Sun, Mars, Saturn): Virupas = 60 - Benefic Arc
 */
export function calculatePakshaBala(planet, sunLongitude, moonLongitude) {
    const elongation = ((moonLongitude - sunLongitude + 360) % 360);
    const isShuklaPaksha = elongation <= 180;
    const beneficVirupas = (isShuklaPaksha ? elongation : (360 - elongation)) / 3;
    const isBenefic = planet === 'Jupiter' || planet === 'Venus' || planet === 'Moon' || planet === 'Mercury';
    const virupas = Math.max(0, Math.min(60, isBenefic ? beneficVirupas : (60 - beneficVirupas)));
    const rupas = virupasToRupas(virupas);
    const evidence = [
        `Moon-Sun Elongation: ${elongation.toFixed(2)}° (${isShuklaPaksha ? 'Shukla Paksha / Waxing' : 'Krishna Paksha / Waning'})`,
        `Paksha Classification for ${planet}: ${isBenefic ? 'Benefic Rule' : 'Malefic Rule'}`,
        `Paksha Bala: ${virupas.toFixed(2)} Virupas (${rupas.toFixed(2)} Rupas)`,
    ];
    return {
        name: 'Paksha Bala',
        subcomponentName: 'PAKSHA_BALA',
        virupas,
        rupas,
        formulaVersion: 'bphs-paksha-v1',
        status: 'IMPLEMENTED_UNBENCHMARKED',
        inputs: { planet, sunLongitude, moonLongitude, elongation, isShuklaPaksha },
        evidence,
    };
}
