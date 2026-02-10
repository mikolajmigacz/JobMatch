import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts', '**/node_modules/**'],
      thresholds: { lines: 30, functions: 30, branches: 30 },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jobmatch/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
