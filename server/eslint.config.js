import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.nodeBuiltin, // Adds console, global, etc.
      },
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
