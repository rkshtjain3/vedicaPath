import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import { SwissEphemerisEngine } from '@vedica/astrology-core';
import { AstrologyBenchmark, validateBenchmark } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Astrology Benchmark Validation Suite', () => {
  const engine = new SwissEphemerisEngine();

  it('should validate CASE-001 (Normal Indian birth) as PASS within tolerance', async () => {
    const casePath = resolve(
      __dirname,
      '../jhora-test-cases/case-001-normal-indian.json'
    );
    const benchmark: AstrologyBenchmark = JSON.parse(readFileSync(casePath, 'utf-8'));

    const report = await validateBenchmark(benchmark, engine, 0.05);

    expect(report.overallStatus).toBe('PASS');
    expect(report.items.every((i) => i.passed)).toBe(true);
  });

  it('should handle NOT_VALIDATED status for placeholder cases without failing test suite', async () => {
    const casePath = resolve(
      __dirname,
      '../jhora-test-cases/case-002-midnight-birth.json'
    );
    const benchmark: AstrologyBenchmark = JSON.parse(readFileSync(casePath, 'utf-8'));

    const report = await validateBenchmark(benchmark, engine, 0.05);

    expect(report.overallStatus).toBe('NOT_VALIDATED');
    expect(report.summary).toContain('NOT_VALIDATED');
  });
});
