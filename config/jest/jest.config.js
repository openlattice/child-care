const PACKAGE = require('../../package.json');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.js',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/config/',
    '<rootDir>/flow-typed/',
  ],
  coverageDirectory: '<rootDir>/coverage',
  globals: {
    __AUTH0_CLIENT_ID__: '__MISSING__',
    __AUTH0_DOMAIN__: '__MISSING__',
    __ENV_DEV__: false,
    __ENV_PROD__: false,
    __PACKAGE__: PACKAGE.name,
    __VERSION__: PACKAGE.version,
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/flow-typed/',
  ],
  rootDir: '../..',
  setupFiles: [
    '<rootDir>/config/jest/enzyme.config.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/test.config.js',
  ],
  testEnvironment: '<rootDir>/config/jest/jsdom.config.js',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/config/jest/babelJestTransformer.js',
  },
};
