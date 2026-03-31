import { defineConfig } from 'tsup';

export default defineConfig([
  // Server-safe utilities (config, helpers) - NO 'use client'
  {
    entry: { server: 'src/config.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next', 'next/navigation'],
  },
  // Client React components and hooks - HAS 'use client'
  {
    entry: { client: 'src/provider.tsx' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next', 'next/navigation'],
    banner: { js: '"use client";' },
  },
  // Main index (re-exports both) - HAS 'use client' because it includes provider
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next', 'next/navigation'],
    banner: { js: '"use client";' },
  },
]);
