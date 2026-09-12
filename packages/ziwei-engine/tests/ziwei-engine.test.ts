import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { evaluateZiWei } from '../src/ziwei-evaluator.js';
import { calculateMingGongBranch, calculateShenGongBranch, getPalaceStem } from '../src/palace-calculator.js';
import { calculateWuxingJu } from '../src/wuxing-ju-calculator.js';

describe('Zi Wei Dou Shu Engine (chinese-ziwei-v1)', () => {
  it('calculates Life Palace (Ming Gong) and Body Palace (Shen Gong) deterministically', () => {
    // Lunar Month 9, Hour Branch Hai (Index 11)
    const mingIdx = calculateMingGongBranch(9, 11);
    const shenIdx = calculateShenGongBranch(9, 11);

    expect(mingIdx).toBe(11); // Hai
    expect(shenIdx).toBe(9); // You
  });

  it('determines Five Tigers Chasing Stems correctly', () => {
    // Jia Year Stem -> Yin Palace starts with Bing (丙)
    const yinStem = getPalaceStem(2, 'Jia');
    expect(yinStem).toBe('Bing');
  });

  it('calculates Wuxing Ju (Five Element Bureau) correctly', () => {
    const bureau1 = calculateWuxingJu('Bing', 'Zi');
    expect(bureau1.name).toBe('Fire 6');
    expect(bureau1.number).toBe(6);

    const bureau2 = calculateWuxingJu('Jia', 'Zi');
    expect(bureau2.name).toBe('Water 2');
    expect(bureau2.number).toBe(2);
  });

  it('evaluates full Zi Wei chart for Rakshit Jain birth case deterministically', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: '1996-09-23',
          timeOfBirth: '23:00:00',
          timezone: 'Asia/Kolkata',
        },
        location: {
          latitude: 29.38747,
          longitude: 76.96825,
          name: 'Panipat, Haryana, India',
          timezone: 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const ziWei = evaluateZiWei(chart);

    expect(ziWei.profileVersion).toBe('chinese-ziwei-v1');
    expect(ziWei.palaces.length).toBe(12);

    const lifePalace = ziWei.palaces.find((p) => p.isLifePalace);
    expect(lifePalace).toBeDefined();
    expect(lifePalace?.type).toBe('LIFE');

    // 14 Major Stars check
    let totalMajorStars = 0;
    for (const p of ziWei.palaces) {
      totalMajorStars += p.majorStars.length;
    }
    expect(totalMajorStars).toBe(14);

    // Si Hua check
    expect(ziWei.siHuaTransformations.length).toBe(4);
    expect(ziWei.calculationHash).toBeDefined();
    expect(ziWei.calculationHash.length).toBe(64);
  });
});
