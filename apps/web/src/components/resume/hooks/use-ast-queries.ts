/**
 * Resume AST Hooks
 * Fetch compiled AST from backend using SDK hooks
 */

import {
  type DslRenderParams,
  type DslRenderPublicParams,
  type ResumeAstDto,
  useDslPreview,
  useDslRender,
  useDslRenderPublic,
} from '@profile/api-client';

/**
 * Fetch compiled AST for a resume
 */
export function useResumeAst(
  resumeId: string | undefined,
  target: 'html' | 'pdf' = 'html',
  options?: { enabled?: boolean },
) {
  const params: DslRenderParams = { target };
  return useDslRender(resumeId ?? '', params, {
    query: {
      enabled: !!resumeId && (options?.enabled ?? true),
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (response) => response.data?.data?.ast as ResumeAstDto | undefined,
    },
  });
}

/**
 * Fetch compiled AST for a public resume
 */
export function usePublicResumeAst(
  slug: string | undefined,
  target: 'html' | 'pdf' = 'html',
  options?: { enabled?: boolean },
) {
  const params: DslRenderPublicParams = { target };
  return useDslRenderPublic(slug ?? '', params, {
    query: {
      enabled: !!slug && (options?.enabled ?? true),
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (response) => response.data?.data?.ast as ResumeAstDto | undefined,
    },
  });
}

/**
 * Preview DSL compilation without persisting
 * Note: useDslPreview is a mutation hook - it returns mutateAsync to call imperatively
 */
export function usePreviewDsl(_target: 'html' | 'pdf' = 'html') {
  return useDslPreview();
}
