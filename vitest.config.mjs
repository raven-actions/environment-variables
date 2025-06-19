// @ts-check

import { defineConfig } from 'vitest/config'

export default defineConfig({
  // base: './',
  test: {
    mockReset: true,
    clearMocks: true,
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    // testNamePattern: 'tests/*.test.{ts,mts}',
    exclude: ['**\/node_modules/**', '**\/dist/**', '**\/.dev/**'],
    coverage: {
      include: ['./src/**/*.ts'],
      ignoreEmptyLines: true,
      extension: ['.ts'],
      reporter: ['text', 'json', 'html', 'text-summary', 'lcov'],
      thresholds: {
        100: true
      }
    }
  }
})
