// @ts-check
/**
 * ESLint Configuration - CI Only (Type-Aware Rules)
 *
 * This ESLint config is designed for CI pipeline ONLY.
 * It focuses exclusively on type-aware rules that require TypeScript Program.
 *
 * Pre-commit uses oxlint for fast structural linting.
 * ESLint in CI validates semantic/type-related issues.
 *
 * @see .oxlintrc.json for pre-commit lint rules
 */
import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
 // Global ignores
 {
  ignores: [
   // Config files
   "eslint.config.mjs",
   "**/*.config.js",
   "**/*.config.mjs",
   
   // Build artifacts
   "**/dist/**",
   "**/node_modules/**",
   "**/coverage/**",
   "**/.next/**",
   "apps/web/.next/**",
   "packages/api-client/dist/**",
   "packages/features/dist/**",
   "packages/stores/dist/**",
   
   // Mobile - deferred
   "apps/mobile/**",
  ],
 },

 // Base configuration for all files
 eslint.configs.recommended,
 ...tseslint.configs.recommendedTypeChecked,
 {
  languageOptions: {
   globals: {
    ...globals.node,
    ...globals.browser,
   },
   ecmaVersion: 2022,
   sourceType: "module",
   parserOptions: {
    projectService: {
        defaultProject: "tsconfig.eslint.json",
    },
    tsconfigRootDir: import.meta.dirname,
   },
  },
 },

 // Production code rules (TYPE-AWARE ONLY - oxlint handles structural lint)
 {
  files: ["packages/**/*.ts", "packages/**/*.tsx", "apps/**/*.ts", "apps/**/*.tsx"],
  ignores: [
   "**/*.spec.ts",
   "**/*.test.ts",
   "**/__tests__/**",
   "**/__mocks__/**",
   "**/tsup.config.ts"
  ],
  rules: {
   // Type-aware rules (cannot be validated by oxlint)
   "@typescript-eslint/no-floating-promises": "error",
   "@typescript-eslint/no-misused-promises": "error",
   "@typescript-eslint/await-thenable": "error",
   "@typescript-eslint/require-await": "error",
   "@typescript-eslint/no-unnecessary-type-assertion": "error",

   // Disable rules that oxlint handles
   "@typescript-eslint/no-unused-vars": "off",
   "@typescript-eslint/no-explicit-any": "off",
   "no-console": "off",
  },
 },

 // Test files - relaxed rules
 {
  files: [
   "**/*.spec.ts",
   "**/*.test.ts",
   "**/__tests__/**/*.ts",
   "test/**/*.ts",
  ],
  rules: {
   "@typescript-eslint/no-floating-promises": "off",
   "@typescript-eslint/no-misused-promises": "off",
   "@typescript-eslint/require-await": "off",
   "@typescript-eslint/no-unsafe-assignment": "off",
   "@typescript-eslint/no-unsafe-member-access": "off",
   "@typescript-eslint/no-unsafe-call": "off",
   "@typescript-eslint/no-unsafe-return": "off",
   "@typescript-eslint/no-unsafe-argument": "off",
   "@typescript-eslint/unbound-method": "off",
   "@typescript-eslint/no-explicit-any": "off",
   "@typescript-eslint/await-thenable": "off",
   "@typescript-eslint/no-redundant-type-constituents": "off"
  },
 }
);
