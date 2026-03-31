/**
 * i18n Architecture Fitness Tests
 *
 * Enforces:
 * 1. Locale parity — EN, PT-BR, and ES have identical dictionary keys
 * 2. Single source of truth — no duplicate i18n config files
 * 3. No hardcoded user-facing strings in components
 *
 * Uncle Bob: "If it matters enough to translate, it matters enough to test."
 */

import { describe, expect, it } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";

// ============================================================================
// Utilities
// ============================================================================

const COMPONENTS_DIR = "apps/web/src/components";
const APP_DIR = "apps/web/src/app";
const FEATURES_DIR = "apps/web/src/features";
const SHARED_DIR = "apps/web/src/shared/components";

const SKIP_DIRS = new Set([
	"node_modules",
	"dist",
	".next",
	"coverage",
	"__tests__",
	"generated",
]);

function getTsxFiles(dir: string): string[] {
	const results: string[] = [];

	function scan(currentDir: string) {
		try {
			const items = fs.readdirSync(currentDir, { withFileTypes: true });
			for (const item of items) {
				if (SKIP_DIRS.has(item.name)) continue;
				const fullPath = path.join(currentDir, item.name);
				if (item.isDirectory()) {
					scan(fullPath);
				} else if (item.name.endsWith(".tsx") && !item.name.includes(".test.")) {
					results.push(fullPath);
				}
			}
		} catch {
			/* directory doesn't exist */
		}
	}

	scan(dir);
	return results;
}

function readFile(filePath: string): string {
	return fs.readFileSync(filePath, "utf-8");
}

/**
 * Strip content that should NOT be flagged as hardcoded strings:
 * - import statements
 * - type/interface declarations
 * - comments (single-line and multi-line)
 * - className/cn() calls (Tailwind)
 * - console.log/warn/error
 * - throw new Error()
 * - data-testid attributes
 * - key= attributes
 * - variant/size/type prop values
 */
function stripNonUserFacing(content: string): string {
	return content
		.replace(/\/\*[\s\S]*?\*\//g, "") // multi-line comments
		.replace(/\/\/.*/g, "") // single-line comments
		.replace(/^import\s+.*$/gm, "") // imports
		.replace(/^export\s+type\s+.*$/gm, "") // type exports
		.replace(/^(interface|type)\s+[\s\S]*?^\}/gm, "") // type/interface blocks
		.replace(/console\.\w+\(.*?\)/g, "") // console calls
		.replace(/throw\s+new\s+\w+\(.*?\)/g, "") // throw statements
		.replace(/className\s*=\s*{[^}]*}/g, "") // className={...}
		.replace(/className\s*=\s*"[^"]*"/g, "") // className="..."
		.replace(/cn\([^)]*\)/g, "") // cn() calls
		.replace(/data-testid\s*=\s*"[^"]*"/g, "") // test ids
		.replace(/key\s*=\s*{[^}]*}/g, ""); // key={...}
}

// Patterns that indicate a hardcoded user-facing string in JSX
const HARDCODED_PATTERNS: Array<{ regex: RegExp; description: string }> = [
	{
		regex: /placeholder\s*=\s*"([A-Z][a-z][\w\s.,'!?()-]{2,})"/g,
		description: "placeholder",
	},
	{
		regex: /aria-label\s*=\s*"([A-Z][a-z][\w\s.,'!?()-]{2,})"/g,
		description: "aria-label",
	},
	{
		regex: /title\s*=\s*"([A-Z][a-z][\w\s.,'!?()-]{2,})"/g,
		description: "title attribute",
	},
	{
		regex: />\s*([A-Z][a-z][\w\s.,'!?()-]{3,})\s*</g,
		description: "JSX text content",
	},
	{
		regex: /toast(?:\.success|\.error|\.info|\.warning)?\(\s*["']([A-Z][a-z][\w\s.,'!?()-]{3,})["']/g,
		description: "toast message",
	},
];

// Files explicitly allowed to have English strings (non-component files)
const ALLOWLIST = new Set([
	"section-label.tsx", // reusable label, content from t()
]);

// Strings that are acceptable without i18n (technical, not user-facing)
const IGNORED_STRINGS = new Set([
	"use client",
	"use server",
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
]);

interface HardcodedViolation {
	file: string;
	line: number;
	match: string;
	pattern: string;
}

function findHardcodedStrings(filePath: string): HardcodedViolation[] {
	const raw = readFile(filePath);
	const content = stripNonUserFacing(raw);
	const lines = content.split("\n");
	const violations: HardcodedViolation[] = [];

	for (const { regex, description } of HARDCODED_PATTERNS) {
		regex.lastIndex = 0;
		let match: RegExpExecArray | null;

		while (true) {
			match = regex.exec(content);
			if (match === null) break;

			const captured = match[1]?.trim() ?? "";

			if (IGNORED_STRINGS.has(captured)) continue;
			if (captured.length < 4) continue;
			// Skip CSS-like values, paths, URLs
			if (/^(flex|grid|block|none|auto|inherit|http|\/)/i.test(captured)) continue;
			// Skip camelCase identifiers (variable names)
			if (/^[a-z]+[A-Z]/.test(captured)) continue;

			const upToMatch = content.slice(0, match.index);
			const lineNumber = upToMatch.split("\n").length;

			violations.push({
				file: filePath,
				line: lineNumber,
				match: captured.slice(0, 60),
				pattern: description,
			});
		}
	}

	return violations;
}

// ============================================================================
// 1. Locale Parity Tests
// ============================================================================

describe("i18n: Locale Parity", () => {
	const dictionariesDir = "packages/i18n/src/dictionaries";

	function getDictionaryModules(locale: string): string[] {
		const dir = path.join(dictionariesDir, locale);
		try {
			return fs
				.readdirSync(dir)
				.filter((f) => f.endsWith(".ts") && f !== "index.ts")
				.sort();
		} catch {
			return [];
		}
	}

	it("EN, PT-BR and ES must have the same dictionary modules", () => {
		const enModules = getDictionaryModules("en");
		const ptBrModules = getDictionaryModules("pt-BR");
		const esModules = getDictionaryModules("es");

		expect(enModules.length).toBeGreaterThan(0);
		expect(ptBrModules).toEqual(enModules);
		expect(esModules).toEqual(enModules);
	});

	it("each locale index.ts must import and spread all modules", () => {
		const enModules = getDictionaryModules("en");
		const moduleNames = enModules.map((f) => f.replace(".ts", ""));

		for (const locale of ["en", "pt-BR", "es"]) {
			const indexPath = path.join(dictionariesDir, locale, "index.ts");
			const content = readFile(indexPath);

			for (const mod of moduleNames) {
				expect(content).toContain(
					`from './${mod}'`,
				);
				expect(content).toMatch(
					new RegExp(`\\.\\.\\.${mod}`),
				);
			}
		}
	});

	it("all locales must export the same number of keys", async () => {
		const { en } = await import(
			`../../packages/i18n/src/dictionaries/en/index.ts`
		);
		const { ptBR } = await import(
			`../../packages/i18n/src/dictionaries/pt-BR/index.ts`
		);
		const { es } = await import(
			`../../packages/i18n/src/dictionaries/es/index.ts`
		);

		const enKeys = Object.keys(en).sort();
		const ptBrKeys = Object.keys(ptBR).sort();
		const esKeys = Object.keys(es).sort();

		const missingInPtBr = enKeys.filter((k) => !ptBrKeys.includes(k));
		const missingInEs = enKeys.filter((k) => !esKeys.includes(k));
		const extraInPtBr = ptBrKeys.filter((k) => !enKeys.includes(k));
		const extraInEs = esKeys.filter((k) => !enKeys.includes(k));

		if (missingInPtBr.length > 0) {
			console.error("Keys missing in PT-BR:", missingInPtBr);
		}
		if (missingInEs.length > 0) {
			console.error("Keys missing in ES:", missingInEs);
		}
		if (extraInPtBr.length > 0) {
			console.error("Extra keys in PT-BR (not in EN):", extraInPtBr);
		}
		if (extraInEs.length > 0) {
			console.error("Extra keys in ES (not in EN):", extraInEs);
		}

		expect(missingInPtBr).toEqual([]);
		expect(missingInEs).toEqual([]);
		expect(extraInPtBr).toEqual([]);
		expect(extraInEs).toEqual([]);
	});

	it("no locale should have empty string values", async () => {
		const locales = {
			en: (await import(`../../packages/i18n/src/dictionaries/en/index.ts`)).en,
			"pt-BR": (
				await import(`../../packages/i18n/src/dictionaries/pt-BR/index.ts`)
			).ptBR,
			es: (await import(`../../packages/i18n/src/dictionaries/es/index.ts`)).es,
		};

		for (const [locale, dict] of Object.entries(locales)) {
			const emptyKeys = Object.entries(dict)
				.filter(([, v]) => typeof v === "string" && v.trim() === "")
				.map(([k]) => k);

			if (emptyKeys.length > 0) {
				console.error(`Empty values in ${locale}:`, emptyKeys);
			}
			expect(emptyKeys).toEqual([]);
		}
	});
});

// ============================================================================
// 2. Single Source of Truth
// ============================================================================

describe("i18n: Single Source of Truth", () => {
	it("no duplicate i18n config outside @profile/i18n package", () => {
		const violations: string[] = [];

		const appFiles = [
			...getTsxFiles("apps/web/src"),
			...getAllTsFiles("apps/web/src"),
		];

		for (const file of appFiles) {
			const content = readFile(file);
			if (content.includes("from '@/config/i18n")) {
				violations.push(file);
			}
		}

		if (violations.length > 0) {
			console.error(
				"Files importing from duplicate config instead of @profile/i18n:",
				violations,
			);
		}
		expect(violations).toEqual([]);
	});

	it("apps/web/src/locales/ should not exist (dead code)", () => {
		const localesDir = "apps/web/src/locales";
		const exists = fs.existsSync(localesDir);
		if (exists) {
			console.error(
				"apps/web/src/locales/ exists — this is dead code. Use @profile/i18n dictionaries.",
			);
		}
		expect(exists).toBe(false);
	});

	it("packages/i18n should not have dead locales/ directory", () => {
		const deadDir = "packages/i18n/src/locales";
		const exists = fs.existsSync(deadDir);
		if (exists) {
			console.error(
				"packages/i18n/src/locales/ exists — dead nested system. Only src/dictionaries/ should exist.",
			);
		}
		expect(exists).toBe(false);
	});
});

// ============================================================================
// 3. Hardcoded String Detection
// ============================================================================

describe("i18n: No Hardcoded Strings", () => {
	it("components should not have hardcoded user-facing strings", () => {
		const dirs = [COMPONENTS_DIR, FEATURES_DIR, SHARED_DIR];
		const allFiles = dirs.flatMap((d) => getTsxFiles(d));
		const allViolations: HardcodedViolation[] = [];

		for (const file of allFiles) {
			const basename = path.basename(file);
			if (ALLOWLIST.has(basename)) continue;

			const violations = findHardcodedStrings(file);
			allViolations.push(...violations);
		}

		if (allViolations.length > 0) {
			console.error("\n=== HARDCODED STRING VIOLATIONS ===\n");
			const byFile = new Map<string, HardcodedViolation[]>();
			for (const v of allViolations) {
				const rel = path.relative(".", v.file);
				const existing = byFile.get(rel) ?? [];
				existing.push(v);
				byFile.set(rel, existing);
			}
			for (const [file, violations] of byFile) {
				console.error(`  ${file}:`);
				for (const v of violations) {
					console.error(
						`    L${v.line} [${v.pattern}]: "${v.match}"`,
					);
				}
			}
			console.error(
				`\n  Total: ${allViolations.length} hardcoded strings in ${byFile.size} files\n`,
			);
		}

		// Report violations — threshold decreases as migration progresses
		// Current baseline: ~155 strings in 44 files (tracked for regression)
		// Target: 0 (change to expect(allViolations).toEqual([]) when complete)
		expect(allViolations.length).toBeLessThan(160);
	});

	it("app pages should use useI18n or t() for user-facing text", () => {
		const pageFiles = getTsxFiles(APP_DIR);
		const violations: string[] = [];

		for (const file of pageFiles) {
			const content = readFile(file);
			const basename = path.basename(file);

			// Skip layout files, loading, error boundaries
			if (/^(layout|loading|error|not-found)\.tsx$/.test(basename)) continue;
			// Skip page.tsx that just imports a component (thin wrappers)
			if (basename === "page.tsx" && content.split("\n").length < 20) continue;

			// Client page components should import useI18n
			if (
				content.includes("'use client'") &&
				content.split("\n").length > 30 &&
				!content.includes("useI18n") &&
				!content.includes("useT")
			) {
				const hardcoded = findHardcodedStrings(file);
				if (hardcoded.length > 0) {
					violations.push(
						`${path.relative(".", file)} — ${hardcoded.length} hardcoded strings, no i18n hook`,
					);
				}
			}
		}

		if (violations.length > 0) {
			console.error("\n=== APP PAGES WITHOUT i18n ===\n");
			for (const v of violations) {
				console.error(`  ${v}`);
			}
		}

		// Report but don't fail yet
		expect(violations.length).toBeLessThan(20);
	});
});

// ============================================================================
// Helper: get all .ts files (not just .tsx)
// ============================================================================

function getAllTsFiles(dir: string): string[] {
	const results: string[] = [];

	function scan(currentDir: string) {
		try {
			const items = fs.readdirSync(currentDir, { withFileTypes: true });
			for (const item of items) {
				if (SKIP_DIRS.has(item.name)) continue;
				const fullPath = path.join(currentDir, item.name);
				if (item.isDirectory()) {
					scan(fullPath);
				} else if (
					item.name.endsWith(".ts") &&
					!item.name.endsWith(".d.ts") &&
					!item.name.includes(".test.") &&
					!item.name.includes(".spec.")
				) {
					results.push(fullPath);
				}
			}
		} catch {
			/* directory doesn't exist */
		}
	}

	scan(dir);
	return results;
}
