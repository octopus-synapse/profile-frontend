/**
 * Resume Builder
 * AST-powered resume editor - backend decides, frontend renders
 * Uses SDK hooks directly - no custom wrappers.
 */

'use client';

import {
  useDslRender,
  useResumeConfigBatchUpdate,
  useResumeConfigReorderSection,
  useResumeConfigToggleSection,
  useResumesGetAllUserResumes,
  useResumesGetResumeByIdForUser,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useCallback } from 'react';
import { showToast } from '@/shared/components/ui/toast';
import { useCopyFeedback } from '@/shared/hooks/use-copy-feedback';
import { ASTRenderer } from './ast-renderer';
import { BuilderDialogs } from './builder/builder-dialogs';
import { BuilderSidebar } from './builder/builder-sidebar';
import { BuilderEmptyState, BuilderLoadingState } from './builder/builder-states';
import { BuilderToolbar } from './builder/builder-toolbar';
import { useBuilderDialogs } from './builder/use-builder-dialogs';
import type { SectionItem } from './config/section-reorder-panel';

interface RawSection {
  id?: string;
  sectionTypeKey?: string;
  order?: number;
  visible?: boolean;
  sectionType?: { key?: string; title?: string };
}

function deriveSectionItems(resume: Record<string, unknown>): SectionItem[] {
  const raw = (resume.resumeSections ?? resume.sections ?? []) as RawSection[];
  return raw.map((s, i) => ({
    id: s.id ?? s.sectionTypeKey ?? `section-${i}`,
    label: s.sectionType?.title ?? s.sectionTypeKey ?? `Section ${i + 1}`,
    visible: s.visible ?? true,
    order: s.order ?? i,
  }));
}

export function ResumeBuilder() {
  const { copied, copy } = useCopyFeedback();
  const { t } = useI18n();
  const dialogs = useBuilderDialogs();

  // Get first resume - SDK hook directly
  const resumesQuery = useResumesGetAllUserResumes({ page: 1, limit: 1 });
  const resumes = (resumesQuery.data?.data?.data as Record<string, unknown> | undefined)?.data as
    | Array<{ id: string }>
    | undefined;
  const resumeId = resumes?.[0]?.id ?? '';

  // Get resume details - SDK hook directly
  const resumeQuery = useResumesGetResumeByIdForUser(resumeId, {
    query: { enabled: !!resumeId },
  });
  const resume = (resumeQuery.data?.data?.data ?? null) as Record<string, unknown> | null;
  const activeThemeId = resume?.activeThemeId as string | undefined;
  const activeTheme = resume?.activeTheme as { id: string; name: string } | undefined;
  const activeThemeName = activeTheme?.name;

  // Get AST from DSL render endpoint - SDK hook directly
  const astQuery = useDslRender(resumeId, undefined, {
    query: { enabled: !!resumeId && !!activeThemeId },
  });
  // Extract AST from the response envelope
  const astResponse = astQuery.data?.data?.data;
  const ast = astResponse?.ast as {
    meta?: unknown;
    page?: unknown;
    sections?: unknown[];
    globalStyles?: unknown;
  } | null;

  // Mutations - SDK hooks directly
  const toggleMutation = useResumeConfigToggleSection();
  const reorderMutation = useResumeConfigReorderSection();
  const batchMutation = useResumeConfigBatchUpdate();

  const sectionItems = resume ? deriveSectionItems(resume) : [];
  const isLoading =
    resumesQuery.isLoading || resumeQuery.isLoading || (resumeId && astQuery.isLoading);

  const handleThemeApplied = useCallback(() => void astQuery.refetch(), [astQuery]);

  const handleCopyLink = useCallback(async () => {
    if (!resumeId) return;
    const url = `${window.location.origin}/r/${resumeId}`;
    const success = await copy(url);
    if (!success) showToast.error(t('resume.builder.failedCopyLink'));
  }, [resumeId, copy, t]);

  const handleOpenSectionEditor = useCallback(
    (sectionTypeKey: string, title?: string) => {
      dialogs.openSectionEditor(sectionTypeKey, title);
    },
    [dialogs],
  );

  if (isLoading) return <BuilderLoadingState />;
  if (!resume) return <BuilderEmptyState />;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#050505]">
      <BuilderSidebar
        resume={{ id: resumeId, activeThemeId, ...resume }}
        activeThemeName={activeThemeName}
        onThemeApplied={handleThemeApplied}
        onRefresh={() => void astQuery.refetch()}
        onImportOpen={() => dialogs.open('import')}
        onHistoryOpen={() => dialogs.open('history')}
        onShareOpen={() => dialogs.open('share')}
        onAnalyticsOpen={() => dialogs.open('analytics')}
        onAtsOpen={() => dialogs.open('ats')}
        onSectionEdit={handleOpenSectionEditor}
        onReorderOpen={() => dialogs.open('reorder')}
      />

      <main className="flex flex-1 flex-col">
        <BuilderToolbar
          resumeName={(resume.fullName as string) ?? ''}
          copied={copied}
          hasResumeId={Boolean(resumeId)}
          onExport={() => dialogs.open('export')}
          onShare={() => void handleCopyLink()}
        />
        <div className="flex-1 overflow-auto bg-[#0a0a0a] p-8">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-lg bg-white shadow-2xl shadow-black/50 ring-1 ring-white/10">
              {!activeThemeId ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center gap-4 p-12 text-zinc-400">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                    <svg
                      className="h-10 w-10 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-zinc-600">
                      {t('resume.builder.selectTheme')}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {t('resume.builder.selectThemeHint')}
                    </p>
                  </div>
                </div>
              ) : ast?.page && ast.sections && ast.globalStyles ? (
                <ASTRenderer ast={ast as unknown as Parameters<typeof ASTRenderer>[0]['ast']} />
              ) : (
                <div className="flex min-h-[500px] flex-col items-center justify-center gap-4 p-12 text-zinc-400">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
                    <svg
                      className="h-10 w-10 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-zinc-600">
                      {t('resume.builder.noAstData')}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {t('resume.builder.noAstDataHint')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BuilderDialogs
        resumeId={resumeId}
        sections={sectionItems}
        isOpen={dialogs.isOpen}
        toggle={dialogs.toggle}
        sectionEditor={dialogs.sectionEditor}
        onToggleVisibility={async (sectionId, visible) => {
          await toggleMutation.mutateAsync({
            resumeId,
            sectionId,
            data: { visible },
          });
        }}
        onReorder={async (sectionId, order) => {
          await reorderMutation.mutateAsync({
            resumeId,
            sectionId,
            data: { order },
          });
        }}
        onBatchUpdate={async (sections) => {
          await batchMutation.mutateAsync({
            resumeId,
            data: { sections },
          });
        }}
      />
    </div>
  );
}
