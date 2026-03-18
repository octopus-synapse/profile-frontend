import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'locales/en': 'src/locales/en.ts',
    'locales/pt-BR': 'src/locales/pt-BR.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  // CRITICAL: Mark React and Next.js as external to prevent duplicate instances
  external: ['react', 'react-dom', 'next', 'next/navigation'],
  banner: {
    js: '"use client";',
  },
});
