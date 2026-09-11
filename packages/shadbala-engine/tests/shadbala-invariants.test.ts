import { describe, expect, it } from 'vitest';
import {
  calculateUchchaBala,
  calculateDigBala,
  calculateOjayugmaBala,
  calculateKendradiBala,
  calculateDrekkanaBala,
  calculateCheshtaBalaFoundation,
  NAISARGIKA_BALA_VIRUPAS,
} from '../src/index.js';
import { RashiDetails } from '@vedica/astrology-core';

describe('Shadbala Invariants — Uchcha Bala Invariants', () => {
  it('yields exactly 60 Virupas at Paramochcha (Sun 10° Aries)', () => {
    const res = calculateUchchaBala('Sun', 10.0);
    expect(res.virupas).toBe(60.0);
    expect(res.rupas).toBe(1.0);
  });

  it('yields exactly 0 Virupas at Paramaneecha (Sun 10° Libra = 190°)', () => {
    const res = calculateUchchaBala('Sun', 190.0);
    expect(res.virupas).toBe(0.0);
    expect(res.rupas).toBe(0.0);
  });

  it('yields exactly 30 Virupas at Midpoint (Sun 100°)', () => {
    const res = calculateUchchaBala('Sun', 100.0);
    expect(res.virupas).toBe(30.0);
    expect(res.rupas).toBe(0.5);
  });

  it('handles 0°/360° circular boundary smoothly for Venus (exaltation 357°)', () => {
    const resNear = calculateUchchaBala('Venus', 357.0);
    expect(resNear.virupas).toBe(60.0);

    const resAcross = calculateUchchaBala('Venus', 1.0);
    expect(resAcross.virupas).toBeGreaterThan(50);
  });
});

describe('Shadbala Invariants — Dig Bala Invariants', () => {
  it('yields maximum 60 Virupas when planet is at its strongest directional cusp', () => {
    // Jupiter strongest in East (H1 / Lagna at 15°). Zero point is West (H7 at 195°).
    // Jupiter at Lagna 15° has distance 180° from zero point -> 180 / 3 = 60 Virupas.
    const resMax = calculateDigBala('Jupiter', 15.0, 15.0);
    expect(resMax.virupas).toBe(60.0);
  });

  it('yields 0 Virupas when planet is at its zero-strength directional cusp', () => {
    // Jupiter zero point at 195° (Lagna 15° + 180°)
    const resZero = calculateDigBala('Jupiter', 195.0, 15.0);
    expect(resZero.virupas).toBe(0.0);
  });

  it('maintains continuous 360° circular wrap-around across $0^\\circ / 360^\\circ$', () => {
    // Lagna at 350° -> Jupiter zero point = (350 + 180) % 360 = 170°
    const resWrap = calculateDigBala('Jupiter', 350.0, 350.0);
    expect(resWrap.virupas).toBe(60.0);
  });
});

describe('Shadbala Invariants — Ojayugma Bala Invariants', () => {
  const oddSign: RashiDetails = { id: 1, name: 'Aries', sanskritName: 'Mesha', ruler: 'Mars' };
  const evenSign: RashiDetails = { id: 2, name: 'Taurus', sanskritName: 'Vrishabha', ruler: 'Venus' };

  it('yields maximum 30 Virupas for male planet in odd signs in D1 and D9', () => {
    const res = calculateOjayugmaBala('Sun', oddSign, oddSign);
    expect(res.virupas).toBe(30);
    expect(res.rupas).toBe(0.5);
  });

  it('yields minimum 0 Virupas for male planet in even signs in D1 and D9', () => {
    const res = calculateOjayugmaBala('Sun', evenSign, evenSign);
    expect(res.virupas).toBe(0);
  });
});

describe('Shadbala Invariants — Kendradi Bala Invariants', () => {
  it('restricts outputs strictly to {60, 30, 15} Virupas', () => {
    const validValues = new Set([60, 30, 15]);
    for (let h = 1; h <= 12; h++) {
      const virupas = calculateKendradiBala('Sun', h).virupas;
      expect(validValues.has(virupas)).toBe(true);
    }
  });
});

describe('Shadbala Invariants — Drekkana Bala Invariants', () => {
  it('restricts outputs strictly to {15, 0} Virupas', () => {
    const validValues = new Set([15, 0]);
    const testDegrees = [0.0, 5.0, 9.999999, 10.0, 15.0, 19.999999, 20.0, 25.0, 29.999999];
    for (const deg of testDegrees) {
      const virupas = calculateDrekkanaBala('Sun', deg).virupas;
      expect(validValues.has(virupas)).toBe(true);
    }
  });

  it('evaluates exact boundary transitions at 10° and 20° for Male, Neutral, Female planets', () => {
    // Male planet (Sun): 1st Drekkana [0, 10) = 15, 2nd [10, 20) = 0, 3rd [20, 30) = 0
    expect(calculateDrekkanaBala('Sun', 9.999999).virupas).toBe(15);
    expect(calculateDrekkanaBala('Sun', 10.0).virupas).toBe(0);

    // Neutral planet (Mercury): 1st = 0, 2nd [10, 20) = 15, 3rd = 0
    expect(calculateDrekkanaBala('Mercury', 9.999999).virupas).toBe(0);
    expect(calculateDrekkanaBala('Mercury', 10.0).virupas).toBe(15);
    expect(calculateDrekkanaBala('Mercury', 19.999999).virupas).toBe(15);
    expect(calculateDrekkanaBala('Mercury', 20.0).virupas).toBe(0);

    // Female planet (Venus): 1st = 0, 2nd = 0, 3rd [20, 30) = 15
    expect(calculateDrekkanaBala('Venus', 19.999999).virupas).toBe(0);
    expect(calculateDrekkanaBala('Venus', 20.0).virupas).toBe(15);
    expect(calculateDrekkanaBala('Venus', 29.999999).virupas).toBe(15);
  });
});
