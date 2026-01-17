/**
 * Theme Picker
 * Elegant theme selection with tabs
 */

"use client";

import { useState } from "react";
import { ThemeCard } from "./theme-card";
import { JsonImportModal } from "./json-import-modal";
import { useSystemThemes, useMyThemes, usePopularThemes } from "../../hooks";
import { useApplyTheme, useForkTheme, useDeleteTheme, useSubmitForApproval } from "../../hooks";
import type { Theme } from "../../services/theme.types";
import { Upload, Sparkles, Users, Palette, Plus } from "lucide-react";
import { cn } from "@/shared/utils";

interface Props {
  resumeId: string;
  activeThemeId?: string | null;
  onThemeApplied?: () => void;
  onEditTheme?: (theme: Theme) => void;
}

type TabId = "system" | "popular" | "mine";

const tabs: { id: TabId; label: string; icon: typeof Sparkles }[] = [
  { id: "system", label: "System", icon: Sparkles },
  { id: "popular", label: "Popular", icon: Users },
  { id: "mine", label: "My Themes", icon: Palette },
];

export function ThemePicker({ resumeId, activeThemeId, onThemeApplied, onEditTheme }: Props) {
  const [tab, setTab] = useState<TabId>("system");
  const [showImport, setShowImport] = useState(false);

  const { data: systemThemes = [], isLoading: loadingSystem } = useSystemThemes();
  const { data: popularThemes = [], isLoading: loadingPopular } = usePopularThemes(10);
  const { data: myThemes = [], isLoading: loadingMine } = useMyThemes();

  const applyTheme = useApplyTheme();
  const forkTheme = useForkTheme();
  const deleteTheme = useDeleteTheme();
  const submitForApproval = useSubmitForApproval();

  const themes = tab === "system" ? systemThemes : tab === "popular" ? popularThemes : myThemes;
  const isLoading =
    tab === "system" ? loadingSystem : tab === "popular" ? loadingPopular : loadingMine;

  const handleSelect = async (theme: Theme) => {
    await applyTheme.mutateAsync({ resumeId, themeId: theme.id });
    onThemeApplied?.();
  };

  const handleFork = async (theme: Theme) => {
    const forked = await forkTheme.mutateAsync({
      themeId: theme.id,
      name: `${theme.name} (Custom)`,
    });
    onEditTheme?.(forked);
  };

  const handleDelete = async (theme: Theme) => {
    if (confirm(`Delete "${theme.name}"?`)) {
      await deleteTheme.mutateAsync(theme.id);
    }
  };

  const handleEdit = (theme: Theme) => {
    onEditTheme?.(theme);
  };

  const handleSubmitForApproval = async (theme: Theme) => {
    await submitForApproval.mutateAsync(theme.id);
  };

  const handleImported = () => {
    setTab("mine");
    setShowImport(false);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-pf-canvas-subtle flex gap-1 rounded-lg p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all",
              tab === id
                ? "bg-pf-canvas-overlay text-pf-fg-default shadow-sm"
                : "text-pf-fg-muted hover:text-pf-fg-default"
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* Import Button */}
      <button
        onClick={() => setShowImport(true)}
        className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
      >
        <Upload className="h-4 w-4" strokeWidth={1.5} />
        Import JSON Theme
      </button>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-pf-canvas-subtle h-20 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {/* Themes */}
      {!isLoading && (
        <div className="space-y-2">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeThemeId}
              onSelect={() => void handleSelect(theme)}
              onEdit={() => handleEdit(theme)}
              onFork={() => void handleFork(theme)}
              onDelete={() => void handleDelete(theme)}
              onSubmitForApproval={() => void handleSubmitForApproval(theme)}
            />
          ))}

          {/* Create New (My Themes only) */}
          {tab === "mine" && (
            <button
              onClick={() => setShowImport(true)}
              className="group border-pf-border-default hover:border-pf-border-emphasis hover:bg-pf-canvas-subtle flex h-16 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
            >
              <Plus
                className="text-pf-fg-subtle group-hover:text-pf-fg-default h-4 w-4"
                strokeWidth={1.5}
              />
              <span className="text-pf-fg-muted group-hover:text-pf-fg-default text-sm font-medium">
                Create New Theme
              </span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && themes.length === 0 && tab !== "mine" && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="bg-pf-canvas-subtle flex h-12 w-12 items-center justify-center rounded-xl">
            <Palette className="text-pf-fg-subtle h-5 w-5" strokeWidth={1.5} />
          </div>
          <p className="text-pf-fg-muted mt-3 text-sm">
            {tab === "popular" ? "No popular themes yet" : "No themes available"}
          </p>
        </div>
      )}

      {/* Import Modal */}
      <JsonImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImported={handleImported}
      />
    </div>
  );
}
