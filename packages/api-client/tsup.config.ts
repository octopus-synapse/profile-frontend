import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "repositories/index": "src/repositories/index.ts",
    "types/index": "src/types/index.ts",
    "errors/index": "src/errors/index.ts",
    "client/index": "src/client/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["axios"],
});
