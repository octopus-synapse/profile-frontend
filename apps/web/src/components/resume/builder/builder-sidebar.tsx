/**
 * Builder Sidebar
 * Clean panel for customization options
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Palette, Settings, RotateCcw, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/shared/utils";
import { ThemePicker } from "../theme";
import { ThemeEditor } from "../theme";
import type { Theme } from "../../services/theme.types";
import type { Resume } from "../../types";

type ViewMode = "preview" | "themes" | "editor";

interface BuilderSidebarProps {
  resume: Resume;
  activeThemeName?: string;
  onThemeApplied: () => void;
  onRefresh: () => void;
}

export function BuilderSidebar({
  resume,
  activeThemeName,
  onThemeApplied,
  onRefresh,
}: BuilderSidebarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme(theme);
    setViewMode("editor");
  };

  const handleEditorClose = () => {
    setEditingTheme(null);
    setViewMode("themes");
  };

  const handleThemeSaved = () => {
    onThemeApplied();
    setEditingTheme(null);
    setViewMode("themes");
  };

  const handleThemeApplied = () => {
    onThemeApplied();
    setViewMode("preview");
  };

  // Stats for the resume
  const stats = [
    { label: "Experience", value: resume.experiences?.length ?? 0 },
    { label: "Education", value: resume.educations?.length ?? 0 },
    { label: "Skills", value: resume.skills?.length ?? 0 },
    { label: "Languages", value: resume.languages?.length ?? 0 },
  ];

  return (
    <aside className="border-pf-border-muted bg-pf-canvas-overlay flex w-80 flex-col border-r">
      {/* Tabs */}
      <div className="border-pf-border-muted flex border-b">
        <TabButton
          active={viewMode === "preview"}
          onClick={() => setViewMode("preview")}
          icon={<Eye className="h-4 w-4" strokeWidth={1.5} />}
          label="Overview"
        />
        <TabButton
          active={viewMode === "themes" || viewMode === "editor"}
          onClick={() => setViewMode("themes")}
          icon={<Palette className="h-4 w-4" strokeWidth={1.5} />}
          label="Themes"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "preview" && (
          <div className="p-4">
            {/* Current Theme */}
            <Section title="Active Theme">
              <button
                onClick={() => setViewMode("themes")}
                className="border-pf-border-default bg-pf-canvas-subtle group hover:border-pf-border-emphasis hover:bg-pf-canvas-inset flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-pf-canvas-overlay flex h-8 w-8 items-center justify-center rounded-md shadow-sm">
                    <Layers className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <span className="text-pf-fg-default text-sm font-medium">
                    {activeThemeName ?? "Modern"}
                  </span>
                </div>
                <ChevronRight
                  className="text-pf-fg-subtle h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </button>
            </Section>

            {/* Stats */}
            <Section title="Resume Stats">
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-pf-canvas-subtle rounded-lg p-3">
                    <p className="text-pf-fg-default text-2xl font-semibold">{stat.value}</p>
                    <p className="text-pf-fg-subtle text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Quick Actions */}
            <Section title="Quick Actions">
              <div className="space-y-2">
                <Link
                  href="/protected/settings"
                  className="border-pf-border-default text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex w-full items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors"
                >
                  <Settings className="text-pf-fg-subtle h-4 w-4" strokeWidth={1.5} />
                  Edit Content
                </Link>
                <button
                  onClick={onRefresh}
                  className="border-pf-border-default text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex w-full items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors"
                >
                  <RotateCcw className="text-pf-fg-subtle h-4 w-4" strokeWidth={1.5} />
                  Refresh Preview
                </button>
              </div>
            </Section>
          </div>
        )}

        {viewMode === "themes" && (
          <div className="p-4">
            <ThemePicker
              resumeId={resume.id}
              activeThemeId={resume.activeThemeId}
              onThemeApplied={handleThemeApplied}
              onEditTheme={handleEditTheme}
            />
          </div>
        )}

        {viewMode === "editor" && editingTheme && (
          <ThemeEditor
            theme={editingTheme}
            onCancel={handleEditorClose}
            onSave={handleThemeSaved}
          />
        )}
      </div>
    </aside>
  );
}

// Helper Components

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "border-pf-border-emphasis text-pf-fg-default"
          : "text-pf-fg-muted hover:text-pf-fg-default border-transparent"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-pf-fg-muted mb-3 text-xs font-medium tracking-wider uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
