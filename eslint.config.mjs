// eslint.config.mjs
import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {
    files: [
      "**/*.test.{js,mjs,cjs}",
      "**/*.spec.{js,mjs,cjs}",
      "**/__tests__/**/*.{js,mjs,cjs}"
    ],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },

  {
    files: ["**/*.{js,mjs,cjs}"]
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"]
  }
]);