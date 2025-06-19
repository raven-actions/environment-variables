import { defineConfig } from 'vitest/config'

export default defineConfig({
  // base: './',
  test: {
    // globals: true,
    clearMocks: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testNamePattern: './tests/*.test.ts',
    exclude: ['**\/node_modules/**', '**\/dist/**', '**\/.dev/**'],
    coverage: {
      include: ['./src/**/*.ts'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        100: true
      }
    }
  }
})
