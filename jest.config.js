module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: [
    '<rootDir>/tests/setup.ts'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/lib/',
    '/node_modules/'
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
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'text-summary', 'cobertura'],
  coverageThreshold: {
    global: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10,
      }
    }
  }
}
