import type { ConfigAPI, TransformOptions } from "@babel/core";

export default function (api: ConfigAPI): TransformOptions {
 api.cache(true);
 return {
  presets: ["babel-preset-expo"],
  plugins: [
   // Required for expo-router
   "expo-router/babel",
  ],
 };
}
