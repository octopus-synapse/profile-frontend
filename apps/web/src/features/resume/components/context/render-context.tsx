/**
 * Render Context
 *
 * Provides pre-compiled AST to resume components.
 *
 * KEY PRINCIPLE: Frontend doesn't decide anything.
 * All layout, tokens, and styles are resolved by the backend.
 * This context just passes the AST to child components.
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResumeAst, PlacedSection } from "@octopus-synapse/profile-contracts";

interface RenderContextValue {
  ast: ResumeAst;
  // Convenience accessors
  page: ResumeAst["page"];
  sections: ResumeAst["sections"];
  globalStyles: ResumeAst["globalStyles"];
}

const RenderContext = createContext<RenderContextValue | null>(null);

export function useRenderContext() {
  const context = useContext(RenderContext);
  if (!context) {
    throw new Error("useRenderContext must be used within RenderProvider");
  }
  return context;
}

interface RenderProviderProps {
  ast: ResumeAst;
  children: ReactNode;
}

/**
 * RenderProvider - Provides compiled AST to resume components
 *
 * Unlike StyleProvider (removed), this doesn't do any token resolution.
 * All values come pre-resolved from the backend.
 */
export function RenderProvider({ ast, children }: RenderProviderProps) {
  const value: RenderContextValue = {
    ast,
    page: ast.page,
    sections: ast.sections,
    globalStyles: ast.globalStyles,
  };

  return <RenderContext.Provider value={value}>{children}</RenderContext.Provider>;
}

/**
 * Hook to get section styles by sectionId
 */
export function useSectionStyles(sectionId: string) {
  const { sections } = useRenderContext();
  const section = sections.find((s: PlacedSection) => s.sectionId === sectionId);

  if (!section) {
    return null;
  }

  return section.styles;
}

/**
 * Hook to get page layout
 */
export function usePageLayout() {
  const { page } = useRenderContext();
  return page;
}

/**
 * Hook to get global styles
 */
export function useGlobalStyles() {
  const { globalStyles } = useRenderContext();
  return globalStyles;
}
