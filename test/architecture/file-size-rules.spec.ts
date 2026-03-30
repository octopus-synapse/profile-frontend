/**
 * File Size Architecture Fitness Tests
 *
 * Enforces:
 * 1. Component files MUST NOT exceed 300 lines (per CLAUDE.md - hard limit)
 * 2. Component files SHOULD NOT exceed 100 lines (ideal target)
 * 3. Large files are architectural defects requiring decomposition
 *
 * Uncle Bob: "Small functions, small files, small classes.
 *            The first rule of functions is that they should be small.
 *            The second rule of functions is that they should be smaller than that."
 */

import { describe, expect, it } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const HARD_LIMIT = 300; // Files MUST NOT exceed this
const SOFT_LIMIT = 100; // Files SHOULD NOT exceed this (ideal target)
const COMPONENTS_DIR = 'apps/web/src/components';

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.next',
  'coverage',
  '__tests__',
  'generated',
]);

// Files that exceed the 300-line hard limit.
// These are tracked debt - remove from this list as files are refactored.
// Target: 0 files in this list.
// 🎉 All files refactored! No more exceptions needed.
const HARD_LIMIT_GRANDFATHERED = new Set<string>([]);

interface FileSizeViolation {
  file: string;
  lines: number;
  excess: number;
}

function getComponentFiles(dir: string): string[] {
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
          (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) &&
          !item.name.endsWith('.d.ts') &&
          !item.name.includes('.test.') &&
          !item.name.includes('.spec.')
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

function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function findOversizedFiles(files: string[], limit: number): FileSizeViolation[] {
  const violations: FileSizeViolation[] = [];

  for (const file of files) {
    const lines = countLines(file);
    if (lines > limit) {
      violations.push({
        file,
        lines,
        excess: lines - limit,
      });
    }
  }

  return violations.sort((a, b) => b.lines - a.lines);
}

describe('File Size: Hard Limit (300 lines)', () => {
  it(`component files MUST NOT exceed ${HARD_LIMIT} lines`, () => {
    const allFiles = getComponentFiles(COMPONENTS_DIR);
    const violations = findOversizedFiles(allFiles, HARD_LIMIT);

    // Filter out grandfathered files
    const newViolations = violations.filter(
      (v) => !HARD_LIMIT_GRANDFATHERED.has(v.file)
    );

    if (newViolations.length > 0) {
      console.error('\n=== CRITICAL: NEW FILES EXCEEDING 300 LINE HARD LIMIT ===\n');
      console.error('These files are architectural defects that MUST be refactored:\n');
      for (const v of newViolations) {
        const rel = path.relative('.', v.file);
        console.error(`  ❌ ${rel}: ${v.lines} lines (+${v.excess} over limit)`);
      }
      console.error('\n');
      console.error('Fix: Split into smaller components, extract data/hooks/types');
      console.error('See CLAUDE.md for architectural guidance.\n');
    }

    expect(newViolations).toEqual([]);
  });

  it('tracks grandfathered files exceeding hard limit', () => {
    const allFiles = getComponentFiles(COMPONENTS_DIR);
    const violations = findOversizedFiles(allFiles, HARD_LIMIT);

    const stillOversized = violations.filter((v) =>
      HARD_LIMIT_GRANDFATHERED.has(v.file)
    );

    const fixed = [...HARD_LIMIT_GRANDFATHERED].filter(
      (f) => !violations.some((v) => v.file === f)
    );

    if (fixed.length > 0) {
      console.log('\n=== GRANDFATHERED FILES NOW UNDER 300 LINES ===\n');
      console.log('These files are now compliant:');
      for (const f of fixed) {
        console.log(`  ✓ ${f}`);
      }
      console.log('\nRemove them from HARD_LIMIT_GRANDFATHERED.\n');
    }

    if (stillOversized.length > 0) {
      console.log('\n=== GRANDFATHERED FILES >300 LINES (critical debt) ===\n');
      for (const v of stillOversized) {
        const rel = path.relative('.', v.file);
        console.log(`  ${rel}: ${v.lines} lines (+${v.excess} over limit)`);
      }
      console.log(`\n  Total: ${stillOversized.length} files need urgent refactoring`);
      console.log('  Target: 0 (remove from HARD_LIMIT_GRANDFATHERED as fixed)\n');
    }

    expect(stillOversized.length).toBeLessThanOrEqual(HARD_LIMIT_GRANDFATHERED.size);
  });
});

describe('File Size: Soft Limit (100 lines)', () => {
  it(`tracks files over ${SOFT_LIMIT} lines for improvement`, () => {
    const allFiles = getComponentFiles(COMPONENTS_DIR);
    const violations = findOversizedFiles(allFiles, SOFT_LIMIT);

    if (violations.length > 0) {
      console.log('\n=== FILES OVER 100 LINES (improvement opportunities) ===\n');

      // Group by severity
      const critical = violations.filter((v) => v.lines > 250);
      const high = violations.filter((v) => v.lines > 200 && v.lines <= 250);
      const medium = violations.filter((v) => v.lines > 150 && v.lines <= 200);
      const low = violations.filter((v) => v.lines <= 150);

      if (critical.length > 0) {
        console.log(`  Critical (>250 lines): ${critical.length} files`);
        for (const v of critical.slice(0, 5)) {
          console.log(`    - ${path.relative('.', v.file)}: ${v.lines} lines`);
        }
        if (critical.length > 5) {
          console.log(`    ... and ${critical.length - 5} more`);
        }
      }

      if (high.length > 0) {
        console.log(`  High (201-250 lines): ${high.length} files`);
      }

      if (medium.length > 0) {
        console.log(`  Medium (151-200 lines): ${medium.length} files`);
      }

      if (low.length > 0) {
        console.log(`  Low (101-150 lines): ${low.length} files`);
      }

      console.log(`\n  Total: ${violations.length} files over ${SOFT_LIMIT} lines`);
      console.log('  Target: 0 (refactor incrementally)\n');
    }

    // This test passes but tracks the debt
    // As the codebase improves, reduce this threshold
    expect(violations.length).toBeLessThan(200); // Current baseline
  });
});
