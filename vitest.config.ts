import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@vedica/astrology-core': resolve(__dirname, 'packages/astrology-core/src/index.ts'),
      '@vedica/panchanga-engine': resolve(__dirname, 'packages/panchanga-engine/src/index.ts'),
      '@vedica/dasha-engine': resolve(__dirname, 'packages/dasha-engine/src/index.ts'),
      '@vedica/yoga-engine': resolve(__dirname, 'packages/yoga-engine/src/index.ts'),
      '@vedica/analysis-engine': resolve(__dirname, 'packages/analysis-engine/src/index.ts'),
      '@vedica/divisional-chart-engine': resolve(__dirname, 'packages/divisional-chart-engine/src/index.ts'),
      '@vedica/ashtakavarga-engine': resolve(__dirname, 'packages/ashtakavarga-engine/src/index.ts'),
      '@vedica/strength-engine': resolve(__dirname, 'packages/strength-engine/src/index.ts'),
      '@vedica/shadbala-engine': resolve(__dirname, 'packages/shadbala-engine/src/index.ts'),
      '@vedica/shared': resolve(__dirname, 'packages/shared/src/index.ts'),
      '@vedica/location-engine': resolve(__dirname, 'packages/location-engine/src/index.ts'),
      '@vedica/numerology-engine': resolve(__dirname, 'packages/numerology-engine/src/index.ts'),
      '@vedica/rules-engine': resolve(__dirname, 'packages/rules-engine/src/index.ts'),
      '@vedica/timing-engine': resolve(__dirname, 'packages/timing-engine/src/index.ts'),
      '@vedica/interpretation-engine': resolve(__dirname, 'packages/interpretation-engine/src/index.ts'),
      '@vedica/life-domain-engine': resolve(__dirname, 'packages/life-domain-engine/src/index.ts'),
      '@vedica/timeline-engine': resolve(__dirname, 'packages/timeline-engine/src/index.ts'),
      '@vedica/transit-engine': resolve(__dirname, 'packages/transit-engine/src/index.ts'),
      '@vedica/query-engine': resolve(__dirname, 'packages/query-engine/src/index.ts'),
      '@vedica/report-engine': resolve(__dirname, 'packages/report-engine/src/index.ts'),
      '@vedica/report-export': resolve(__dirname, 'packages/report-export/src/index.ts'),
      '@vedica/chart-renderer': resolve(__dirname, 'packages/chart-renderer/src/index.ts'),
      '@vedica/ai-engine': resolve(__dirname, 'packages/ai-engine/src/index.ts'),
      '@vedica/benchmark-store': resolve(__dirname, 'packages/benchmark-store/src/index.ts'),
      '@vedica/jaimini-engine': resolve(__dirname, 'packages/jaimini-engine/src/index.ts'),
    },
  },
  test: {
    include: ['packages/**/*.test.ts', 'validation/**/*.test.ts', 'apps/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      'apps/**/e2e/**',
      'apps/**/tests/e2e/**',
      '**/*.spec.ts',
    ],
  },
});
