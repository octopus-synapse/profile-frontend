import { defineConfig } from "tsup";

export default defineConfig({
 entry: {
  index: "src/index.ts",
  "locales/en": "src/locales/en.ts",
  "locales/pt-BR": "src/locales/pt-BR.ts",
 },
 format: ["cjs", "esm"],
 dts: true,
 clean: true,
 sourcemap: true,
 splitting: false,
});
