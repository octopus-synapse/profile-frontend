/**
 * Context - Barrel Export
 */

// Legacy: StyleProvider (to be deprecated, replaced by RenderProvider)
export { StyleProvider, useStyleConfig } from "./style-context";

// New: RenderProvider (receives pre-compiled AST from backend)
export {
  RenderProvider,
  useRenderContext,
  useSectionStyles,
  usePageLayout,
  useGlobalStyles,
} from "./render-context";
