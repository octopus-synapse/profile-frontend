/**
 * Architecture Fitness Tests
 *
 * These tests enforce architectural constraints:
 * 1. No profile-contracts imports anywhere
 * 2. No client-side Zod validation (server validates)
 * 3. Proper dependency direction
 * 4. Components must come from profile-ui
 *
 * Uncle Bob: "Architecture tests are executable specifications of intent."
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";

// ============================================================================
// Utilities
// ============================================================================

function getAllTypeScriptFiles(dir: string): string[] {
 const results: string[] = [];

 function scan(currentDir: string) {
  try {
   const items = fs.readdirSync(currentDir, { withFileTypes: true });

   for (const item of items) {
    const fullPath = path.join(currentDir, item.name);

    // Skip node_modules, dist, generated, .next
    if (
     item.name === "node_modules" ||
     item.name === "dist" ||
     item.name === "generated" ||
     item.name === ".next" ||
     item.name === "coverage"
    ) {
     continue;
    }

    if (item.isDirectory()) {
     scan(fullPath);
    } else if (item.name.match(/\.(ts|tsx)$/) && !item.name.includes(".d.ts")) {
     results.push(fullPath);
    }
   }
  } catch {
   // Directory doesn't exist or permission denied
  }
 }

 scan(dir);
 return results;
}

// ============================================================================
// Tests
// ============================================================================

describe("Architecture Rules", () => {
 describe("profile-contracts Elimination", () => {
  it("should have ZERO imports from profile-contracts in apps/web/src", () => {
   const srcFiles = getAllTypeScriptFiles("apps/web/src");
   const violations: string[] = [];

   for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (content.includes("profile-contracts")) {
     violations.push(file);
    }
   }

   expect(violations).toEqual([]);
  });

  it("should have ZERO imports from profile-contracts in packages/", () => {
   const srcFiles = getAllTypeScriptFiles("packages");
   const violations: string[] = [];

   for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    // Check for actual imports, not comments
    const lines = content.split("\n");
    for (const line of lines) {
     const trimmed = line.trim();
     // Skip comments
     if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("/*")
     ) {
      continue;
     }
     if (line.includes("profile-contracts")) {
      violations.push(file);
      break;
     }
    }
   }

   expect(violations).toEqual([]);
  });

  it("should NOT have profile-contracts in any package.json dependencies", () => {
   const packageJsonFiles = [
    "package.json",
    "apps/web/package.json",
    "apps/mobile/package.json",
    "packages/api-client/package.json",
    "packages/stores/package.json",
    "packages/i18n/package.json",
   ];

   const violations: string[] = [];

   for (const pkgFile of packageJsonFiles) {
    if (fs.existsSync(pkgFile)) {
     const content = fs.readFileSync(pkgFile, "utf-8");
     if (content.includes("profile-contracts")) {
      violations.push(pkgFile);
     }
    }
   }

   expect(violations).toEqual([]);
  });
 });

 describe("Validation Strategy", () => {
  it("should NOT have Zod schema validation (.safeParse/.parse) in apps/web/src", () => {
   const srcFiles = getAllTypeScriptFiles("apps/web/src");
   const violations: string[] = [];

   for (const file of srcFiles) {
    // Skip config files that legitimately use Zod for env validation
    if (file.includes("config/env")) continue;
    // Skip test files
    if (
     file.includes(".test.") ||
     file.includes(".spec.") ||
     file.includes("__tests__")
    )
     continue;

    const content = fs.readFileSync(file, "utf-8");

    // Look for Schema.parse() or Schema.safeParse() patterns
    if (
     (content.includes(".parse(") || content.includes(".safeParse(")) &&
     content.includes("Schema")
    ) {
     violations.push(`${file} contains client-side Zod validation`);
    }
   }

   expect(violations).toEqual([]);
  });

  it("should NOT import Zod schemas from any package", () => {
   const srcFiles = getAllTypeScriptFiles("apps/web/src");
   const violations: string[] = [];

   for (const file of srcFiles) {
    // Skip config files
    if (file.includes("config/env")) continue;

    const content = fs.readFileSync(file, "utf-8");

    // Look for imports of *Schema from anywhere
    const schemaImportPattern = /import\s*\{[^}]*\w+Schema[^}]*\}\s*from/g;
    if (schemaImportPattern.test(content)) {
     violations.push(`${file} imports Zod schemas`);
    }
   }

   expect(violations).toEqual([]);
  });
 });

 describe("Dependency Direction (Clean Architecture)", () => {
  it("packages/stores should depend on api-client", () => {
   const storesPkg = JSON.parse(
    fs.readFileSync("packages/stores/package.json", "utf-8"),
   );
   expect(storesPkg.dependencies?.["@profile/api-client"]).toBeDefined();
  });

  it("apps/web should depend on stores, api-client, and i18n", () => {
   const webPkg = JSON.parse(fs.readFileSync("apps/web/package.json", "utf-8"));
   expect(webPkg.dependencies?.["@profile/api-client"]).toBeDefined();
   expect(webPkg.dependencies?.["@profile/stores"]).toBeDefined();
   expect(webPkg.dependencies?.["@profile/i18n"]).toBeDefined();
  });

  it("apps/web should depend on profile-ui", () => {
   const webPkg = JSON.parse(fs.readFileSync("apps/web/package.json", "utf-8"));
   expect(webPkg.dependencies?.["@octopus-synapse/profile-ui"]).toBeDefined();
  });

  it("packages should NOT depend on apps", () => {
   const packageDirs = [
    "packages/api-client",
    "packages/hooks",
    "packages/stores",
   ];

   for (const pkgDir of packageDirs) {
    const pkgFile = `${pkgDir}/package.json`;
    if (fs.existsSync(pkgFile)) {
     const content = fs.readFileSync(pkgFile, "utf-8");
     expect(content.includes("@profile/web")).toBe(false);
     expect(content.includes("@profile/mobile")).toBe(false);
    }
   }
  });
 });

 describe("Linting Configuration", () => {
  it("should use Biome, not ESLint", () => {
   // biome.json should exist at root
   expect(fs.existsSync("biome.json")).toBe(true);

   // ESLint configs should NOT exist
   expect(fs.existsSync("eslint.config.mjs")).toBe(false);
   expect(fs.existsSync(".eslintrc.js")).toBe(false);
   expect(fs.existsSync(".eslintrc.json")).toBe(false);
  });

  it("root package.json should have biome in devDependencies", () => {
   const rootPkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
   expect(rootPkg.devDependencies?.["@biomejs/biome"]).toBeDefined();
  });

  it("root package.json should NOT have eslint or oxlint", () => {
   const rootPkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
   expect(rootPkg.devDependencies?.eslint).toBeUndefined();
   expect(rootPkg.devDependencies?.oxlint).toBeUndefined();
  });
 });

 describe("Version Constraints", () => {
  it("should enforce Bun 1.3.9", () => {
   const rootPkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
   expect(rootPkg.engines?.bun).toBe("1.3.9");
  });
 });
});
