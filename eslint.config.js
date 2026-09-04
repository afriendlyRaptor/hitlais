
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist"] },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    ...react.configs.flat.recommended,

    plugins: {
      "react-hooks": reactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],

      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Core JavaScript
      "no-var": "error",
      "no-await-in-loop": "error",
      "no-constant-binary-expression": "error",
      "no-duplicate-imports": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "no-unused-private-class-members": "error",
      "no-use-before-define": "error",

      // Disabled
      "no-extra-boolean-cast": "off",
    },
  }
);
