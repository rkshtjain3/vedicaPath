import { describe, it, expect } from 'vitest';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { evaluateBaZi, calculateFourPillars, classifyTenGod, HEAVENLY_STEMS } from '../src/index.js';

describe('BaZi Engine Unit Tests (chinese-bazi-v1)', () => {
  it('calculates Ten Gods classification correctly relative to Day Master', () => {
    const dmJia = HEAVENLY_STEMS.Jia; // Yang Wood

    // Friend (Same Yang Wood)
    const friend = classifyTenGod(dmJia, HEAVENLY_STEMS.Jia);
    expect(friend.name).toBe('Friend');
    expect(friend.category).toBe('SELF');

    // Rob Wealth (Yin Wood)
    const robWealth = classifyTenGod(dmJia, HEAVENLY_STEMS.Yi);
    expect(robWealth.name).toBe('Rob Wealth');
    expect(robWealth.category).toBe('SELF');

    // Eating God (Yang Fire)
    const eatingGod = classifyTenGod(dmJia, HEAVENLY_STEMS.Bing);
    expect(eatingGod.name).toBe('Eating God');
    expect(eatingGod.category).toBe('OUTPUT');

    // Hurting Officer (Yin Fire)
    const hurtingOfficer = classifyTenGod(dmJia, HEAVENLY_STEMS.Ding);
    expect(hurtingOfficer.name).toBe('Hurting Officer');

    // Direct Wealth (Yin Earth)
    const directWealth = classifyTenGod(dmJia, HEAVENLY_STEMS.Ji);
    expect(directWealth.name).toBe('Direct Wealth');
    expect(directWealth.category).toBe('WEALTH');

    // Seven Killings (Yang Metal)
    const sevenKillings = classifyTenGod(dmJia, HEAVENLY_STEMS.Geng);
    expect(sevenKillings.name).toBe('Seven Killings');
    expect(sevenKillings.category).toBe('OFFICER');

    // Direct Resource (Yin Water)
    const directResource = classifyTenGod(dmJia, HEAVENLY_STEMS.Gui);
    expect(directResource.name).toBe('Direct Resource');
    expect(directResource.category).toBe('RESOURCE');
  });

  it('golden regression test for Rakshit Jain birth chart (1996-09-23 23:00:00 IST, Panipat)', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1996-09-23', timeOfBirth: '23:00:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 29.38747, longitude: 76.96825, name: 'Panipat', timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const bazi = evaluateBaZi(chart, { gender: 'MALE' });

    expect(bazi.profileVersion).toBe('chinese-bazi-v1');

    // 1. Year Pillar
    expect(bazi.fourPillars.year.stem.name).toBe('Bing');
    expect(bazi.fourPillars.year.branch.name).toBe('Zi');

    // 2. Month Pillar
    expect(bazi.fourPillars.month.stem.name).toBe('Ding');
    expect(bazi.fourPillars.month.branch.name).toBe('You');

    // 3. Day Pillar
    expect(bazi.fourPillars.day.stem.name).toBe('Gui');
    expect(bazi.fourPillars.day.branch.name).toBe('Mao');

    // 4. Hour Pillar
    expect(bazi.fourPillars.hour.stem.name).toBe('Ren');
    expect(bazi.fourPillars.hour.branch.name).toBe('Zi');

    // 5. Day Master Details
    expect(bazi.dayMaster.stem.name).toBe('Gui');
    expect(bazi.dayMaster.stem.element).toBe('Water');
    expect(bazi.dayMaster.monthBranch.name).toBe('You');

    // 6. Five Elements Balance
    expect(bazi.fiveElements).toHaveLength(5);

    // 7. Luck Pillars
    expect(bazi.luckPillars.direction).toBe('FORWARD');
    expect(bazi.luckPillars.pillars).toHaveLength(10);
  });

  it('verifies cross-engine isolation: BaZi does not alter Vedic birth chart data', async () => {
    const engine = new SwissEphemerisEngine();
    const chart = await engine.calculateBirthChart(
      {
        birthTime: { dateOfBirth: '1996-09-23', timeOfBirth: '23:00:00', timezone: 'Asia/Kolkata' },
        location: { latitude: 29.38747, longitude: 76.96825, name: 'Panipat', timezone: 'Asia/Kolkata' },
      },
      PERSONAL_VEDIC_V1
    );

    const originalJson = JSON.stringify(chart);
    evaluateBaZi(chart);
    expect(JSON.stringify(chart)).toBe(originalJson);
  });
});
