/**
 * Theme Picker Component
 * Beautiful grid of themes with import functionality
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
      {/* Header with Tabs and Import Button */}
      <div className="flex flex-col gap-3">
        <div className="bg-pf-canvas-subtle inline-flex rounded-lg p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all",
                tab === id
                  ? "bg-pf-canvas-default text-pf-fg-default shadow-sm"
                  : "text-pf-fg-muted hover:text-pf-fg-default"
              )}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowImport(true)}
          className="bg-pf-accent-emphasis text-pf-fg-on-emphasis flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:opacity-90"
        >
          <Upload className="h-3.5 w-3.5" />
          Import JSON Theme
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-pf-canvas-subtle h-24 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* Themes Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-3">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeThemeId}
              onSelect={() => handleSelect(theme)}
              onEdit={() => handleEdit(theme)}
              onFork={() => handleFork(theme)}
              onDelete={() => handleDelete(theme)}
              onSubmitForApproval={() => handleSubmitForApproval(theme)}
            />
          ))}

          {/* Create New Theme Card (only in My Themes tab) */}
          {tab === "mine" && (
            <button
              onClick={() => setShowImport(true)}
              className="border-pf-border-default hover:border-pf-accent-emphasis hover:bg-pf-canvas-subtle group flex h-20 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all"
            >
              <div className="flex items-center gap-2">
                <Plus className="text-pf-fg-muted group-hover:text-pf-accent-fg h-4 w-4 transition-colors" />
                <span className="text-pf-fg-muted group-hover:text-pf-fg-default text-xs font-medium transition-colors">
                  Create New Theme
                </span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && themes.length === 0 && tab !== "mine" && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-pf-canvas-subtle mb-3 rounded-full p-3">
            <Palette className="text-pf-fg-muted h-6 w-6" />
          </div>
          <p className="text-pf-fg-muted text-xs">
            {tab === "popular" ? "No popular themes yet" : "No themes available"}
          </p>
        </div>
      )}

      {/* JSON Import Modal */}
      <JsonImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImported={handleImported}
      />
    </div>
  );
}
