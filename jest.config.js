module.exports = {
  projects: ["<rootDir>/packages/*/jest.config.js"],
  modulePathIgnorePatterns: [".cache", "npm-cache", ".npm"],
  collectCoverageFrom: ["**/src/**/*.ts", "!todel-test-helpers/**"],
};
