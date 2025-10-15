import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        module: "readonly",
        require: "readonly",
        process: "readonly",
        exports: "readonly",
        Buffer: "readonly",
      },
    },
    rules: {
      "no-restricted-globals": ["error", "name", "length"],
      "prefer-arrow-callback": "off",
      "quotes": ["error", "double", { allowTemplateLiterals: true }],
      "require-jsdoc": "off",
      "no-unused-vars": "off",
    },
  },
];