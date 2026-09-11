import { defineConfig } from 'vitest/config';

export default defineConfig({
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
