/**
 * Jest Configuration
 * Uncle Bob: "Configuration should be explicit and maintainable"
 */

/** @type {import('jest').Config} */
const config = {
  // Environment
  testEnvironment: "jsdom", // React components need DOM

  // Transform
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },

  // Transform MSW and its ESM dependencies
  transformIgnorePatterns: [
    "node_modules/(?!(msw|@mswjs|@bundled-es-modules|until-async|@open-draft|strict-event-emitter)/)",
  ],

  // Module resolution
  moduleNameMapper: {
    // Path aliases
    "^@/(.*)$": "<rootDir>/src/$1",

    // Mock static assets
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  // Test patterns
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)", "**/*.test.(ts|tsx)"],

  // Setup
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Coverage
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.tsx",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
  ],

  coverageThreshold: {
    global: {
      branches: 45,
      functions: 45,
      lines: 45,
      statements: 45,
    },
  },

  // Performance
  maxWorkers: "50%",
  testTimeout: 10000,

  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],

  modulePathIgnorePatterns: ["<rootDir>/.next/"],

  // Transform node_modules that use ESM
  transformIgnorePatterns: ["node_modules/(?!(next-auth|@auth|msw)/)"],
};

module.exports = config;
