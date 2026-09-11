import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
export function buildLagnaSummary(chart) {
    const lagna = chart.lagna;
    const lagnaLord = chart.houseLords?.find((hl) => hl.house === 1)?.lord || 'Unknown';
    const lordPlanet = chart.planets?.find((p) => p.planet === lagnaLord);
    const longInSign = typeof lagna.longitudeInSign === 'number' ? lagna.longitudeInSign : (lagna.longitude || 0) % 30;
    const text = `Ascendant (Lagna) is in ${lagna.sign} at ${longInSign.toFixed(2)}° (${lagna.nakshatra} Nakshatra, Pada ${lagna.pada}). Lagna Lord is ${lagnaLord}${lordPlanet ? `, positioned in ${lordPlanet.sign} (House ${lordPlanet.house})` : ''}.`;
    const evidence = [
        createEvidenceItem('lagna_position', 'astrology-core', 'LAGNA_FACT', `Lagna sign: ${lagna.sign}, Nakshatra: ${lagna.nakshatra} (Pada ${lagna.pada}).`, 'FACTUAL', 'HIGH', 'GENERAL', 'LAGNA', lagna),
        createEvidenceItem('lagna_lord_placement', 'astrology-core', 'HOUSE_LORDSHIP', `1st Lord (${lagnaLord}) placed in ${lordPlanet?.sign || 'Unknown'} (House ${lordPlanet?.house || 1}).`, 'FACTUAL', 'HIGH', 'GENERAL', `LORD_1_${lagnaLord}`, lordPlanet),
    ];
    return { text, evidence };
}
