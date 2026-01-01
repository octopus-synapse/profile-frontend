/**
 * Resume Builder
 * Elegant editor for viewing and customizing resumes
 */

"use client";

import { useState, useCallback } from "react";
import { useResumes, useResume, useTheme, useExportResumePDF, useExportResumeDOCX } from "../hooks";
import { ResumeRenderer } from "./resume-renderer";
import { BuilderSidebar } from "./builder/builder-sidebar";
import { MODERN_CONFIG } from "../types/presets";
import type { ResumeStyleConfig } from "../types/config";
import { Download, FileText, Share2, Link2, Check, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/shared/components/ui";

export function ResumeBuilder() {
  const [copied, setCopied] = useState(false);

  // Fetch user's resumes list
  const { data: resumesList, isLoading: resumesListLoading } = useResumes();
  const resumeId = resumesList?.[0]?.id;

  // Fetch full resume data
  const {
    data: resume,
    isLoading: resumeLoading,
    refetch: refetchResume,
  } = useResume(resumeId ?? "");

  // Combined loading state
  const isLoading = resumesListLoading || (resumeId && resumeLoading);

  // Fetch active theme details
  const { data: activeTheme } = useTheme(resume?.activeThemeId ?? undefined);

  // Export mutations
  const exportPDF = useExportResumePDF();
  const exportDOCX = useExportResumeDOCX();

  // Get style config from theme or use default
  const styleConfig: Partial<ResumeStyleConfig> = activeTheme?.styleConfig
    ? (activeTheme.styleConfig as Partial<ResumeStyleConfig>)
    : MODERN_CONFIG;

  const handleThemeApplied = useCallback(() => {
    refetchResume();
  }, [refetchResume]);

  const handleExportPDF = async () => {
    if (!resume) return;
    try {
      const blob = await exportPDF.mutateAsync(resume.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.fullName ?? "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  const handleExportDOCX = async () => {
    if (!resume) return;
    try {
      const blob = await exportDOCX.mutateAsync(resume.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.fullName ?? "resume"}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export DOCX:", error);
    }
  };

  const handleCopyLink = async () => {
    if (!resume?.slug) return;
    const url = `${window.location.origin}/r/${resume.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            href="/onboarding"
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
        resume={resume}
        activeThemeName={activeTheme?.name}
        onThemeApplied={handleThemeApplied}
        onRefresh={() => refetchResume()}
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
                {resume.fullName ?? "Untitled Resume"}
              </h1>
              <p className="text-xs text-zinc-500">Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={exportPDF.isPending}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-3.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              {exportPDF.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <Download className="h-4 w-4" strokeWidth={1.5} />
              )}
              PDF
            </button>

            {/* Export DOCX */}
            <button
              onClick={handleExportDOCX}
              disabled={exportDOCX.isPending}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-3.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              {exportDOCX.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              ) : (
                <FileText className="h-4 w-4" strokeWidth={1.5} />
              )}
              DOCX
            </button>

            {/* Divider */}
            <div className="mx-1 h-5 w-px bg-white/10" />

            {/* Share */}
            {resume.isPublic && resume.slug ? (
              <button
                onClick={handleCopyLink}
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
            ) : (
              <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-500/10 px-3 text-sm font-medium text-amber-500">
                <Share2 className="h-4 w-4" strokeWidth={1.5} />
                Private
              </span>
            )}
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-lg bg-[#0A0A0A]/80 shadow-xl ring-1 ring-white/10">
              <ResumeRenderer resume={resume} styleConfig={styleConfig} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
