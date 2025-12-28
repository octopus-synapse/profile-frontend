/**
 * Resume Builder Component
 * Main component for viewing and customizing resume with themes
 */

"use client";

import { useState, useCallback } from "react";
import { useResumes, useResume, useTheme, useExportResumePDF, useExportResumeDOCX } from "../hooks";
import { ResumeRenderer } from "./resume-renderer";
import { ThemePicker } from "./theme";
import { ThemeEditor } from "./theme";
import { MODERN_CONFIG } from "../types/presets";
import type { Theme } from "../services/theme.types";
import type { ResumeStyleConfig } from "../types/config";
import { cn } from "@/shared/utils";
import {
  Download,
  FileText,
  Share2,
  Palette,
  Eye,
  ChevronLeft,
  ChevronRight,
  Link2,
  Check,
  Loader2,
  Code2,
  Settings,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type ViewMode = "preview" | "themes" | "editor";

export function ResumeBuilder() {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch user's resumes list
  const { data: resumesList, isLoading: resumesListLoading } = useResumes();
  const resumeId = resumesList?.[0]?.id;

  // Fetch full resume data
  const { data: resume, isLoading: resumeLoading, refetch: refetchResume } = useResume(resumeId ?? "");

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
    setViewMode("preview");
  }, [refetchResume]);

  const handleThemeSaved = useCallback(
    (_theme: Theme) => {
      refetchResume();
      setEditingTheme(null);
      setViewMode("themes");
    },
    [refetchResume]
  );

  const handleEditTheme = useCallback((theme: Theme) => {
    setEditingTheme(theme);
    setViewMode("editor");
  }, []);

  const handleEditorClose = useCallback(() => {
    setEditingTheme(null);
    setViewMode("themes");
  }, []);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-pf-fg-muted h-8 w-8 animate-spin" />
          <span className="text-pf-fg-muted font-mono text-sm">loading_resume()...</span>
        </div>
      </div>
    );
  }

  // No resume found
  if (!resume) {
    return (
      <div className="border-pf-border-default bg-pf-canvas-overlay flex min-h-[60vh] flex-col items-center justify-center border p-8">
        <FileText className="text-pf-fg-muted mb-4 h-16 w-16" strokeWidth={1.5} />
        <h2 className="text-pf-fg-default mb-2 font-mono text-lg">no_resume_found</h2>
        <p className="text-pf-fg-muted mb-6 max-w-md text-center font-mono text-sm">
          Complete the onboarding to create your first resume, or add your information in settings.
        </p>
        <div className="flex gap-3">
          <Link
            href="/onboarding"
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center gap-2 px-4 py-2 font-mono text-sm transition-opacity hover:opacity-90"
          >
            <Code2 className="h-4 w-4" strokeWidth={1.5} />
            start_onboarding()
          </Link>
          <Link
            href="/protected/settings"
            className="border-pf-border-default text-pf-fg-default flex items-center gap-2 border px-4 py-2 font-mono text-sm transition-colors hover:bg-pf-canvas-subtle"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-pf-canvas-overlay border-pf-border-default flex flex-col border transition-all duration-300",
          sidebarOpen ? "w-80" : "w-12"
        )}
      >
        {/* Sidebar Header */}
        <div className="border-pf-border-default flex items-center justify-between border-b p-3">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
              <span className="text-pf-fg-muted font-mono text-xs">// customization</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-pf-fg-muted hover:text-pf-fg-default p-1 transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Sidebar Content */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-4">
            {/* View Mode Tabs */}
            <div className="mb-4 flex gap-1">
              <button
                onClick={() => setViewMode("preview")}
                className={cn(
                  "flex-1 px-3 py-2 font-mono text-xs transition-colors",
                  viewMode === "preview"
                    ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
                    : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
                )}
              >
                <Eye className="mr-1.5 inline-block h-3 w-3" strokeWidth={1.5} />
                preview
              </button>
              <button
                onClick={() => setViewMode("themes")}
                className={cn(
                  "flex-1 px-3 py-2 font-mono text-xs transition-colors",
                  viewMode === "themes"
                    ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
                    : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
                )}
              >
                <Palette className="mr-1.5 inline-block h-3 w-3" strokeWidth={1.5} />
                themes
              </button>
            </div>

            {/* Theme Picker (when in themes mode) */}
            {viewMode === "themes" && (
              <ThemePicker
                resumeId={resume.id}
                activeThemeId={resume.activeThemeId}
                onThemeApplied={handleThemeApplied}
                onEditTheme={handleEditTheme}
              />
            )}

            {/* Theme Editor (when editing) */}
            {viewMode === "editor" && editingTheme && (
              <ThemeEditor theme={editingTheme} onCancel={handleEditorClose} onSave={handleThemeSaved} />
            )}

            {/* Preview Info */}
            {viewMode === "preview" && (
              <div className="space-y-4">
                {/* Current Theme */}
                <div className="border-pf-border-default bg-pf-canvas-subtle border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Palette className="text-pf-fg-muted h-3 w-3" strokeWidth={1.5} />
                    <span className="text-pf-fg-muted font-mono text-xs">active_theme</span>
                  </div>
                  <p className="text-pf-fg-default font-mono text-sm">
                    {activeTheme?.name ?? "Modern (Default)"}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="border-pf-border-default bg-pf-canvas-subtle border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-pf-fg-muted h-3 w-3" strokeWidth={1.5} />
                    <span className="text-pf-fg-muted font-mono text-xs">resume_stats</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-pf-fg-muted flex justify-between">
                      <span>experiences:</span>
                      <span className="text-pf-fg-default">{resume.experiences?.length ?? 0}</span>
                    </div>
                    <div className="text-pf-fg-muted flex justify-between">
                      <span>education:</span>
                      <span className="text-pf-fg-default">{resume.educations?.length ?? 0}</span>
                    </div>
                    <div className="text-pf-fg-muted flex justify-between">
                      <span>skills:</span>
                      <span className="text-pf-fg-default">{resume.skills?.length ?? 0}</span>
                    </div>
                    <div className="text-pf-fg-muted flex justify-between">
                      <span>languages:</span>
                      <span className="text-pf-fg-default">{resume.languages?.length ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setViewMode("themes")}
                    className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle flex w-full items-center gap-2 border px-3 py-2 font-mono text-xs transition-colors"
                  >
                    <Palette className="h-3 w-3" strokeWidth={1.5} />
                    change_theme()
                  </button>
                  <Link
                    href="/protected/settings"
                    className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle flex w-full items-center gap-2 border px-3 py-2 font-mono text-xs transition-colors"
                  >
                    <Settings className="h-3 w-3" strokeWidth={1.5} />
                    edit_content()
                  </Link>
                  <button
                    onClick={() => refetchResume()}
                    className="border-pf-border-default text-pf-fg-muted hover:bg-pf-canvas-subtle flex w-full items-center gap-2 border px-3 py-2 font-mono text-xs transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" strokeWidth={1.5} />
                    refresh()
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <div className="border-pf-border-default bg-pf-canvas-overlay mb-4 flex items-center justify-between border p-3">
          <div className="flex items-center gap-2">
            <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// resume_preview</span>
            <span className="text-pf-fg-default ml-2 font-mono text-sm">{resume.fullName ?? "Untitled"}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Buttons */}
            <button
              onClick={handleExportPDF}
              disabled={exportPDF.isPending}
              className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle disabled:opacity-50 flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors"
            >
              {exportPDF.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.5} />
              ) : (
                <Download className="h-3 w-3" strokeWidth={1.5} />
              )}
              export_pdf()
            </button>
            <button
              onClick={handleExportDOCX}
              disabled={exportDOCX.isPending}
              className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle disabled:opacity-50 flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors"
            >
              {exportDOCX.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.5} />
              ) : (
                <FileText className="h-3 w-3" strokeWidth={1.5} />
              )}
              export_docx()
            </button>

            {/* Share Button */}
            {resume.isPublic && resume.slug && (
              <button
                onClick={handleCopyLink}
                className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-opacity hover:opacity-90"
              >
                {copied ? (
                  <Check className="h-3 w-3" strokeWidth={1.5} />
                ) : (
                  <Link2 className="h-3 w-3" strokeWidth={1.5} />
                )}
                {copied ? "copied!" : "share()"}
              </button>
            )}

            {!resume.isPublic && (
              <div className="text-pf-attention-fg flex items-center gap-1.5 font-mono text-xs">
                <Share2 className="h-3 w-3" strokeWidth={1.5} />
                <span>private</span>
              </div>
            )}
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-pf-canvas-subtle flex-1 overflow-auto p-8">
          <div className="mx-auto">
            <ResumeRenderer resume={resume} styleConfig={styleConfig} className="shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
