/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/.*\\.integration\\.test\\.ts$', // Skip integration tests by default
  ],
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: [],
};

module.exports = config;
