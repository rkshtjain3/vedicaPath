import { describe, it, expect } from 'vitest';
import { calculateAshtaKoota, evaluateKujaDosha } from '../index.js';
describe('Ashta Koota Compatibility Engine', () => {
    it('calculates Ashta Koota matching points between Moon Nakshatras', () => {
        // Rohini (Taurus, 4th pad) vs Uttara Phalguni (Virgo, 2nd pad)
        const res = calculateAshtaKoota(4, 4, 12, 2);
        expect(res.totalObtained).toBeGreaterThanOrEqual(0);
        expect(res.totalObtained).toBeLessThanOrEqual(36);
        expect(res.maxTotal).toBe(36);
        expect(res.scores.find(s => s.kootaName === 'Varna')?.maxPoints).toBe(1);
        expect(res.scores.find(s => s.kootaName === 'Nadi')?.maxPoints).toBe(8);
    });
    it('detects Kuja Dosha accurately', () => {
        const mockChartWithMars1 = {
            planets: [
                { planet: 'Mars', longitude: 15, sign: { name: 'Aries' }, isRetrograde: false },
            ],
            lagna: { longitude: 10 },
            houses: [{ house: 1, sign: 'Aries' }],
        };
        const dosha = evaluateKujaDosha(mockChartWithMars1, 'Test Person');
        // Mars is in Aries (own sign) so Kuja Dosha is cancelled
        expect(dosha.isCancelled).toBe(true);
        expect(dosha.afflictedHouses).toContain(1);
    });
});
