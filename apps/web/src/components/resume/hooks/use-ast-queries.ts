/**
 * Resume AST Hooks
 * Fetch compiled AST from backend
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { astKeys } from "./ast-query-keys";
import type { ResumeAst } from "@profile/api-client";

/**
 * Fetch compiled AST for a resume
 */
export function useResumeAst(
 resumeId: string | undefined,
 target: "html" | "pdf" = "html",
 options?: { enabled?: boolean },
) {
 return useQuery({
  queryKey: resumeId ? astKeys.render(resumeId, target) : [],
  queryFn: async () => {
   if (!resumeId) throw new Error("Resume ID required");
   const result = await apiClient.dsl.render(resumeId, target);
   return result.ast as ResumeAst;
  },
  enabled: !!resumeId && (options?.enabled ?? true),
  staleTime: 1000 * 60 * 5, // 5 minutes
 });
}

/**
 * Fetch compiled AST for a public resume
 */
export function usePublicResumeAst(
 slug: string | undefined,
 target: "html" | "pdf" = "html",
 options?: { enabled?: boolean },
) {
 return useQuery({
  queryKey: slug ? astKeys.publicRender(slug, target) : [],
  queryFn: async () => {
   if (!slug) throw new Error("Slug required");
   const result = await apiClient.dsl.renderPublic(slug, target);
   return result.ast as ResumeAst;
  },
  enabled: !!slug && (options?.enabled ?? true),
  staleTime: 1000 * 60 * 5, // 5 minutes
 });
}

/**
 * Preview DSL compilation without persisting
 */
export function usePreviewDsl(
 dsl: unknown,
 target: "html" | "pdf" = "html",
 options?: { enabled?: boolean },
) {
 return useQuery({
  queryKey: ["ast", "preview", dsl, target],
  queryFn: async () => {
   if (!dsl) throw new Error("DSL required");
   const result = await apiClient.dsl.preview(dsl, target);
   return result.ast as ResumeAst;
  },
  enabled: !!dsl && (options?.enabled ?? true),
  staleTime: 0, // Always refetch for preview
 });
}
