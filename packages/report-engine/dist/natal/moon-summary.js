import { createEvidenceItem } from '../evidence/evidence-normalizer.js';
export function buildMoonSummary(chart) {
    const moon = chart.planets?.find((p) => p.planet === 'Moon');
    if (!moon) {
        return { text: 'Moon position data unavailable.', evidence: [] };
    }
    const longInSign = typeof moon.longitudeInSign === 'number' ? moon.longitudeInSign : (moon.longitude || 0) % 30;
    const text = `Moon is located in ${moon.sign} at ${longInSign.toFixed(2)}° (${moon.nakshatra} Nakshatra, Pada ${moon.pada}) in House ${moon.house}.`;
    const evidence = [
        createEvidenceItem('moon_position', 'astrology-core', 'MOON_FACT', `Moon in ${moon.sign}, Nakshatra: ${moon.nakshatra} Pada ${moon.pada}, House ${moon.house}.`, 'FACTUAL', 'HIGH', 'GENERAL', 'MOON', moon),
    ];
    return { text, evidence };
}
