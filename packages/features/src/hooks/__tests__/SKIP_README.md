# Hook Tests - Temporarily Skipped

## Issue

Hook tests require DOM environment (happy-dom or jsdom) for React Testing Library's `renderHook`.

The workspace has a dependency resolution issue with `@octopus-synapse/profile-contracts` that prevents installing new packages:

```
error: Workspace dependency "@octopus-synapse/profile-contracts" not found
```

## Files Affected

- `useAuth.test.ts.skip` (14 tests)
- `useResume.test.ts.skip` (15 tests)
- `useTheme.test.ts.skip` (16 tests)

**Total: 45 tests**

## Solution Options

1. **Fix workspace dependency**: Link `profile-contracts` properly in the monorepo
2. **Use Bun's native DOM**: Bun may add DOM support natively in future versions
3. **Refactor tests**: Rewrite tests to not use `renderHook` (test store logic directly)

## To Re-enable

1. Install happy-dom: `bun add -d happy-dom`
2. Update bunfig.toml: `preload = ["happy-dom/global"]`
3. Rename files: `mv useAuth.test.ts.skip useAuth.test.ts`

## Temporary Workaround

Hook tests are skipped by renaming to `.test.ts.skip`. Store tests (which don't need DOM) still run.
