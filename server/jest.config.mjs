import config from "./__tests__/config.json" with { type: "json" };

export default {
  verbose: true,
  globals: config,
  testMatch: ["**/__tests__/**/*.test.js"],
  testTimeout: 30000
};
