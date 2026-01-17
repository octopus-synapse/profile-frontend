/**
 * Metro configuration for React Native + Expo + Monorepo + NativeWind
 * Learn more: https://docs.expo.dev/guides/monorepos/
 */

import { getDefaultConfig } from "expo/metro-config";
import { withNativeWind } from "nativewind/metro";
import path from "path";

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
// CRITICAL: Mobile's node_modules MUST come first to use the correct React version
config.resolver.nodeModulesPaths = [
 path.resolve(projectRoot, "node_modules"),
 path.resolve(workspaceRoot, "node_modules"),
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. Packages that MUST be resolved from mobile's node_modules (React 18)
const mobileOnlyPackages = ["react", "react-dom", "react-native"];

// 5. Custom resolver to force React 18 from mobile for ALL requests
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
 // Force react packages to always resolve from mobile's node_modules
 if (
  mobileOnlyPackages.some(
   (pkg) => moduleName === pkg || moduleName.startsWith(pkg + "/")
  )
 ) {
  return {
   filePath: require.resolve(moduleName, {
    paths: [path.resolve(projectRoot, "node_modules")],
   }),
   type: "sourceFile",
  };
 }

 // Default resolution
 if (originalResolveRequest) {
  // @ts-ignore
  return originalResolveRequest(context, moduleName, platform);
 }
 return context.resolveRequest(context, moduleName, platform);
};

export default withNativeWind(config, { input: "./global.css" });
