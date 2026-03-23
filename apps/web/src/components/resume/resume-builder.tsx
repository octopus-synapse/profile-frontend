/**
 * Resume Builder
 * AST-powered resume editor - backend decides, frontend renders
 */

'use client';

import { useI18n } from '@profile/i18n';
import { Check, Download, FileText, Link2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { LoadingState } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import { useCopyFeedback } from '@/shared/hooks/use-copy-feedback';
import { AnalyticsDashboard } from './analytics/analytics-dashboard';
import { ASTRenderer } from './ast-renderer';
import { AtsScorePanel } from './ats/ats-score-panel';
import { BuilderSidebar } from './builder/builder-sidebar';
import { SectionReorderPanel } from './config/section-reorder-panel';
import type { SectionItem } from './config/section-reorder-panel';
import { ExportDialog } from './export/export-dialog';
import { useResume, useResumeAst, useResumes, useToggleSection, useReorderSection, useBatchUpdateSections } from './hooks';
import { ImportWizard } from './import/import-wizard';
import { extractResumeListItems } from './resume-builder.utils';
import { ShareLinksManager } from './sharing/share-links-manager';
import { SkillsEditor } from './skills/skills-editor';
import { VersionHistorySidebar } from './versions/version-history-sidebar';

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
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);

  // Fetch user's resumes list
  const { data: resumesResponse, isLoading: resumesListLoading } = useResumes();
  const resumesList = extractResumeListItems(resumesResponse);
  const resumeId = resumesList?.[0]?.id;

  // Fetch full resume data
  const { data: resumeResponse, isLoading: resumeLoading } = useResume(resumeId ?? '');
  // Extract the actual resume data from response
  const resume = resumeResponse?.data;
  // activeThemeId may be present at runtime even if not typed in the generated DTO
  const activeThemeId = (resume as Record<string, unknown> | undefined)?.activeThemeId as
    | string
    | undefined;

  // Fetch compiled AST from backend
  const { data: ast, isLoading: astLoading, refetch: refetchAst } = useResumeAst(resumeId);

  // Section config mutations
  const toggleSection = useToggleSection(resumeId ?? '');
  const reorderSection = useReorderSection(resumeId ?? '');
  const batchUpdate = useBatchUpdateSections(resumeId ?? '');

  const sectionItems = resume ? deriveSectionItems(resume as unknown as Record<string, unknown>) : [];

  // Combined loading state
  const isLoading = resumesListLoading || resumeLoading || (resumeId && astLoading);

  const handleThemeApplied = useCallback(() => {
    void refetchAst();
  }, [refetchAst]);

  const handleCopyLink = async () => {
    if (!resumeId) return;
    const url = `${window.location.origin}/r/${resumeId}`;
    const success = await copy(url);
    if (!success) showToast.error(t('resume.builder.failedCopyLink'));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-white/5">
        <LoadingState message={t('resume.builder.loading')} minHeight="80vh" />
      </div>
    );
  }

  // No resume found
  if (!resume) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white/5 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <FileText className="h-8 w-8 text-zinc-500" strokeWidth={1.5} />
        </div>
        <h2 className="mt-6 text-lg font-semibold text-white">{t('resume.builder.noResume.title')}</h2>
        <p className="mt-2 max-w-sm text-center text-sm text-zinc-400">
          {t('resume.builder.noResume.description')}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/protected/onboarding"
            className="inline-flex h-10 items-center rounded-lg bg-white px-5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            {t('resume.builder.noResume.getStarted')}
          </Link>
          <Link
            href="/protected/settings"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            {t('app.settings.title')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white/5">
      {/* Sidebar */}
      <BuilderSidebar
        resume={{ id: resumeId ?? '', activeThemeId, ...resume }}
        activeThemeName={undefined}
        onThemeApplied={handleThemeApplied}
        onRefresh={() => void refetchAst()}
        onImportOpen={() => setImportOpen(true)}
        onHistoryOpen={() => setHistoryOpen(true)}
        onShareOpen={() => setShareOpen(true)}
        onAnalyticsOpen={() => setAnalyticsOpen(true)}
        onAtsOpen={() => setAtsOpen(true)}
        onSkillsOpen={() => setSkillsOpen(true)}
        onReorderOpen={() => setReorderOpen(true)}
      />

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Toolbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0A0A0A]/80 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <FileText className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                {resume.fullName ?? t('resume.builder.untitledResume')}
              </h1>
              <p className="text-xs text-zinc-500">{t('resume.builder.preview')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export */}
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-3.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              {t('action.export')}
            </button>

            {/* Divider */}
            <div className="mx-1 h-5 w-px bg-white/10" />

            {/* Share */}
            {resumeId ? (
              <button
                type="button"
                onClick={() => void handleCopyLink()}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={1.5} />
                    {t('resume.builder.copied')}
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" strokeWidth={1.5} />
                    {t('resume.builder.share')}
                  </>
                )}
              </button>
            ) : null}
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-lg bg-[#0A0A0A]/80 shadow-xl ring-1 ring-white/10">
              {ast ? (
                <ASTRenderer ast={ast} />
              ) : (
                <div className="p-8 text-center text-gray-400">{t('resume.builder.noAstData')}</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ExportDialog resumeId={resumeId ?? ''} open={exportOpen} onOpenChange={setExportOpen} />

      <ImportWizard open={importOpen} onOpenChange={setImportOpen} />

      <VersionHistorySidebar
        resumeId={resumeId ?? ''}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.shareLinks.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.shareLinks.description')}</DialogDescription>
          </DialogHeader>
          <ShareLinksManager resumeId={resumeId ?? ''} />
        </DialogContent>
      </Dialog>

      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.analytics.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.analytics.description')}</DialogDescription>
          </DialogHeader>
          <AnalyticsDashboard resumeId={resumeId ?? ''} />
        </DialogContent>
      </Dialog>

      <Dialog open={atsOpen} onOpenChange={setAtsOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.ats.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.ats.description')}</DialogDescription>
          </DialogHeader>
          <AtsScorePanel resumeId={resumeId ?? ''} />
        </DialogContent>
      </Dialog>

      <Dialog open={skillsOpen} onOpenChange={setSkillsOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.skills.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.skills.description')}</DialogDescription>
          </DialogHeader>
          <SkillsEditor resumeId={resumeId ?? ''} />
        </DialogContent>
      </Dialog>

      <Dialog open={reorderOpen} onOpenChange={setReorderOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.reorder.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.reorder.description')}</DialogDescription>
          </DialogHeader>
          <SectionReorderPanel
            resumeId={resumeId ?? ''}
            sections={sectionItems}
            onToggleVisibility={async (sectionId, visible) => {
              await toggleSection.mutateAsync({ sectionId, visible });
            }}
            onReorder={async (sectionId, newOrder) => {
              await reorderSection.mutateAsync({ sectionId, order: newOrder });
            }}
            onBatchUpdate={async (sections) => {
              await batchUpdate.mutateAsync(sections);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
