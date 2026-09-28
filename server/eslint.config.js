export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-undef": "error",
      quotes: ["error", "double"],
    },
  },
  {
    files: ["__tests__/**/*.js"],
    languageOptions: {
      globals: {
        global: "readonly",
      },
    },
  },
];
