const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/**
 *  @type {import("@jest/types").Config.InitialOptions}
 */
const customJestConfig = {
  clearMocks: true,

  coverageProvider: "v8",

  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/Stories.tsx", "!**/*.d.ts"],

  collectCoverage: true,

  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  moduleDirectories: ["node_modules", "src"],

  modulePaths: ["<rootDir>/src"],

  roots: ["src"],

  moduleNameMapper: {
    nanoid: "<rootDir>/src/__tests__/__mocks__/nanoid.ts",
  },

  setupFiles: [
    "<rootDir>/src/__tests__/_/setupGlobals.ts",
    "<rootDir>/src/__tests__/_/consoleOverrides.ts",
  ],

  setupFilesAfterEnv: ["<rootDir>/src/__tests__/_/setupAfterEnv.ts"],

  testEnvironment: "jsdom",

  testMatch: ["**/?(*.)+(spec).ts?(x)"],

  transform: {},

  transformIgnorePatterns: [],

  testTimeout: 20000,
};

export default async (...args: any[]) =>
  createJestConfig(customJestConfig)(...args);
