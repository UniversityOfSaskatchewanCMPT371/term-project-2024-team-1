/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: "..",
  testMatch: ["<rootDir>/e2e/**/*.e2e.test.ts"],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: "detox/runners/jest/globalSetup",
  globalTeardown: "detox/runners/jest/globalTeardown",
  reporters: ["detox/runners/jest/reporter"],
  testEnvironment: "detox/runners/jest/testEnvironment",
  verbose: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: [
    "/node_modules/(?!react-native|react-navigation|rn-fetch-blob|@myob|deprecated-react-native-listview)",
  ],
};
