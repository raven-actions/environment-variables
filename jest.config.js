module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/tests/setup.ts'
  ],
  clearMocks: true,
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  testMatch: ['<rootDir>/tests/**/*.test.(ts|js)'],
  transform: {
    '.+\\.tsx?$': [
      'ts-jest',
      {
        'babelConfig': false
      }
    ],
    '^.+\\.ts$': ['ts-jest', {
      'babelConfig': false
    }]
  },
  verbose: true,
  reporters: [
    'default',
    'summary',
    ['github-actions', { silent: false }],
    ['jest-junit', { outputDirectory: 'reports', outputName: 'jest-report.xml' }]
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/lib/',
    '/node_modules/'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'text-summary', 'cobertura'],
  coverageThreshold: {
    global: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      }
    }
  }
}
