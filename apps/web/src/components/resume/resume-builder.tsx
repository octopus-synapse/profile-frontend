/**
 * Resume Builder
 * AST-powered resume editor - backend decides, frontend renders
 */

'use client';

import { Check, Download, FileText, Link2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { LoadingState } from '@/shared/components/ui';
import { showToast } from '@/shared/components/ui/toast';
import { ASTRenderer } from './ast-renderer';
import { BuilderSidebar } from './builder/builder-sidebar';
import { ExportDialog } from './export/export-dialog';
import { useResume, useResumeAst, useResumes } from './hooks';
import { extractResumeListItems } from './resume-builder.utils';

export function ResumeBuilder() {
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Fetch user's resumes list
  const { data: resumesResponse, isLoading: resumesListLoading } = useResumes();
  const resumesList = extractResumeListItems(resumesResponse);
  const resumeId = resumesList?.[0]?.id;

  // Fetch full resume data
  const { data: resumeResponse, isLoading: resumeLoading } = useResume(resumeId ?? '');
  // Extract the actual resume data from response
  const resume = resumeResponse?.data;
  // activeThemeId may be present at runtime even if not typed in the generated DTO
  const activeThemeId = (resume as Record<string, unknown> | undefined)?.activeThemeId as string | undefined;

  // Fetch compiled AST from backend
  const { data: ast, isLoading: astLoading, refetch: refetchAst } = useResumeAst(resumeId);

  // Combined loading state
  const isLoading = resumesListLoading || resumeLoading || (resumeId && astLoading);

  const handleThemeApplied = useCallback(() => {
    void refetchAst();
  }, [refetchAst]);

  const handleCopyLink = async () => {
    if (!resumeId) return;
    const url = `${window.location.origin}/r/${resumeId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast.error('Failed to copy link');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-white/5">
        <LoadingState message="Loading resume..." minHeight="80vh" />
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
        <h2 className="mt-6 text-lg font-semibold text-white">No Resume Yet</h2>
        <p className="mt-2 max-w-sm text-center text-sm text-zinc-400">
          Complete the onboarding to create your resume, or add information manually.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/protected/onboarding"
            className="inline-flex h-10 items-center rounded-lg bg-white px-5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/protected/settings"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            Settings
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
                {resume.fullName ?? 'Untitled Resume'}
              </h1>
              <p className="text-xs text-zinc-500">Preview</p>
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
              Export
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
                    Copied
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" strokeWidth={1.5} />
                    Share
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
                <div className="p-8 text-center text-gray-400">No AST data</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ExportDialog resumeId={resumeId ?? ''} open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}
