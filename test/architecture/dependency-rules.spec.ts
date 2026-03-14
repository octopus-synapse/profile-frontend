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

 describe("Store Deprecation", () => {
  it("apps/web/src components should NOT import from @profile/stores", () => {
   const srcFiles = getAllTypeScriptFiles("apps/web/src");
   const violations: string[] = [];

   for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");

    // Check for imports from @profile/stores (package has been deleted)
    if (
     content.includes('from "@profile/stores"') ||
     content.includes("from '@profile/stores'") ||
     content.includes('from "@profile/stores/')
    ) {
     violations.push(
      `${file} imports from @profile/stores - use SDK hooks instead`,
     );
    }
   }

   expect(violations).toEqual([]);
  });

  it("packages should NOT import from @profile/stores", () => {
   const packageDirs = ["packages/api-client", "packages/i18n", "packages/test-utils"];
   const violations: string[] = [];

   for (const pkgDir of packageDirs) {
    if (!fs.existsSync(pkgDir)) continue;
    const srcFiles = getAllTypeScriptFiles(pkgDir);
    for (const file of srcFiles) {
     const content = fs.readFileSync(file, "utf-8");
     if (
      content.includes('from "@profile/stores"') ||
      content.includes("from '@profile/stores'")
     ) {
      violations.push(
       `${file} imports from @profile/stores - use SDK hooks instead`,
      );
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
  it("apps/web should depend on api-client and i18n", () => {
   const webPkg = JSON.parse(fs.readFileSync("apps/web/package.json", "utf-8"));
   expect(webPkg.dependencies?.["@profile/api-client"]).toBeDefined();
   expect(webPkg.dependencies?.["@profile/i18n"]).toBeDefined();
  });

  it("apps/web should depend on profile-ui", () => {
   const webPkg = JSON.parse(fs.readFileSync("apps/web/package.json", "utf-8"));
   expect(webPkg.dependencies?.["@octopus-synapse/profile-ui"]).toBeDefined();
  });

  it("packages should NOT depend on apps", () => {
   const packageDirs = [
    "packages/api-client",
    "packages/i18n",
    "packages/test-utils",
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

 describe("Generic Sections Architecture", () => {
  it("should NOT have hardcoded section-specific API endpoints in repositories", () => {
   // The generic sections API uses: /v1/resumes/:id/sections/:sectionTypeKey/items
   // Old pattern was: /v1/resumes/:id/experiences, /v1/resumes/:id/education, etc.
   const repositoryFiles = getAllTypeScriptFiles("apps/web/src/components/settings/services");
   const violations: string[] = [];

   // Legacy endpoint patterns that should NOT exist
   const legacyPatterns = [
    /\/resumes\/[^/]+\/experiences(?!-)/,  // /resumes/:id/experiences
    /\/resumes\/[^/]+\/education(?!s)/,    // /resumes/:id/education
    /\/resumes\/[^/]+\/skills[^-]/,        // /resumes/:id/skills
    /\/resumes\/[^/]+\/languages[^-]/,     // /resumes/:id/languages
    /\/resumes\/[^/]+\/certifications/,    // /resumes/:id/certifications
    /\/resumes\/[^/]+\/projects/,          // /resumes/:id/projects
   ];

   for (const file of repositoryFiles) {
    const content = fs.readFileSync(file, "utf-8");
    for (const pattern of legacyPatterns) {
     if (pattern.test(content)) {
      violations.push(
       `${file} uses legacy section-specific endpoint - use /sections/:sectionTypeKey/items`,
      );
      break;
     }
    }
   }

   expect(violations).toEqual([]);
  });

  it("should use generic sections repository for all section CRUD", () => {
   // All section CRUD should go through generic-sections-repository
   const settingsServices = getAllTypeScriptFiles("apps/web/src/components/settings/services");
   
   // generic-sections-repository.ts must exist
   const hasGenericRepo = settingsServices.some((f) => f.includes("generic-sections-repository"));
   expect(hasGenericRepo).toBe(true);
  });

  it("section hooks should use TanStack Query, not direct API calls", () => {
   const hooksFiles = getAllTypeScriptFiles("apps/web/src/components/settings/hooks");
   const violations: string[] = [];

   for (const file of hooksFiles) {
    // Skip non-hook files
    if (!file.includes("use-")) continue;

    const content = fs.readFileSync(file, "utf-8");
    
    // Should use useQuery/useMutation from @tanstack/react-query
    if (!content.includes("useQuery") && !content.includes("useMutation")) {
     // This file might not be a data hook, check if it has API calls
     if (content.includes("apiClient") || content.includes("fetch(")) {
      violations.push(
       `${file} makes API calls but doesn't use TanStack Query`,
      );
     }
    }
   }

   expect(violations).toEqual([]);
  });
 });

 describe("SDK-Only CRUD", () => {
  it("should NOT have direct fetch calls in feature components", () => {
   const featureFiles = getAllTypeScriptFiles("apps/web/src/features");
   const violations: string[] = [];

   for (const file of featureFiles) {
    // Skip hooks which legitimately use SDK
    if (file.includes("/hooks/")) continue;
    // Skip services which wrap SDK
    if (file.includes("/services/")) continue;
    // Skip test files
    if (file.includes(".test.") || file.includes(".spec.")) continue;

    const content = fs.readFileSync(file, "utf-8");

    // Direct fetch calls indicate bypassing SDK layer
    if (content.includes("fetch(") && content.includes("/api/")) {
     violations.push(`${file} makes direct fetch calls - use SDK hooks instead`);
    }
   }

   expect(violations).toEqual([]);
  });

  it("settings components should NOT have direct fetch calls", () => {
   const settingsComponents = getAllTypeScriptFiles("apps/web/src/components/settings");
   const violations: string[] = [];

   for (const file of settingsComponents) {
    // Skip services and hooks layers
    if (file.includes("/services/") || file.includes("/hooks/")) continue;
    // Skip test files
    if (file.includes(".test.") || file.includes(".spec.")) continue;

    const content = fs.readFileSync(file, "utf-8");

    if (content.includes("fetch(") && content.includes("/api/")) {
     violations.push(
      `${file} has direct fetch calls - use repository/hooks layer`,
     );
    }
   }

   expect(violations).toEqual([]);
  });
 });
});
