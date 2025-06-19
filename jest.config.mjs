/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/dist/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/tests/**/*.test.(ts|js)'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  verbose: true,
  reporters: [
    'default',
    'summary',
    ['github-actions', { silent: false }],
    ['jest-junit', { outputDirectory: 'reports', outputName: 'jest-report.xml' }]
  ],
  collectCoverageFrom: ['<rootDir>/src/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['clover', 'json', 'json-summary', 'lcov', 'text', 'text-summary', 'cobertura'],
  coverageThreshold: {
    global: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10
      }
    }
  }
}
