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
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  clearMocks: true,

  coverageProvider: "v8",
  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules", "src"],

  modulePaths: ["<rootDir>/src"],

  roots: ["src"],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "json",
  //   "node"
  // ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  // preset: undefined,

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state between every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state between every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [
    // "<rootDir>/__tests__/setupDotEnv.ts",
    "<rootDir>/src/__tests__/setupGlobals.ts",
    "<rootDir>/src/__tests__/consoleOverrides.ts",
  ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setupAfterEnv.ts"],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/?(*.)+(spec).ts?(x)", "**/?(*.)+(spec).ts?(x)"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  // timers: "real",

  // A map from regular expressions to paths to transformers
  transform: {},

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [],

  testTimeout: 10000,
};

export default async (...args: any[]) =>
  createJestConfig(customJestConfig)(...args);
