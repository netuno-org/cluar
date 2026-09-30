import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.browser, // Adds window, document, localStorage, etc.
        ...globals.nodeBuiltin, // Adds console, global, etc.
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-undef": "error",
      quotes: ["error", "double"],
    },
  },
];
