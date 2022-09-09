/* eslint-disable max-len */
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/**
 *  @type {import("@jest/types").Config.InitialOptions}
 */
const customJestConfig = {
  clearMocks: true,

  coverageProvider: "v8",

  moduleDirectories: ["node_modules", "src"],

  modulePaths: ["<rootDir>/src"],

  roots: ["src"],

  moduleNameMapper: {},

  setupFiles: [
    "<rootDir>/src/__tests__/_/setupGlobals.ts",
    "<rootDir>/src/__tests__/_/consoleOverrides.ts",
  ],

  setupFilesAfterEnv: ["<rootDir>/src/__tests__/_/setupAfterEnv.ts"],

  testEnvironment: "jsdom",

  testMatch: ["**/__tests__/**/?(*.)+(spec).ts?(x)", "**/?(*.)+(spec).ts?(x)"],

  transform: {},

  transformIgnorePatterns: [],

  testTimeout: 10000,
};

export default async (...args: any[]) =>
  createJestConfig(customJestConfig)(...args);
