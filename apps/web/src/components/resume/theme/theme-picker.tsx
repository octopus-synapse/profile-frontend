/**
 * Theme Picker
 * Elegant theme selection with tabs
 */

'use client';

import { Palette, Plus, Sparkles, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/utils';
import {
  useApplyTheme,
  useDeleteTheme,
  useForkTheme,
  useMyThemes,
  usePopularThemes,
  useSubmitForApproval,
  useSystemThemes,
} from '../hooks';
import type { Theme } from '../services/theme.types';
import { JsonImportModal } from './json-import-modal';
import { ThemeCard } from './theme-card';

interface Props {
  resumeId: string;
  activeThemeId?: string | null;
  onThemeApplied?: () => void;
  onEditTheme?: (theme: Theme) => void;
}

type TabId = 'system' | 'popular' | 'mine';

const tabs: { id: TabId; label: string; icon: typeof Sparkles }[] = [
  { id: 'system', label: 'System', icon: Sparkles },
  { id: 'popular', label: 'Popular', icon: Users },
  { id: 'mine', label: 'My Themes', icon: Palette },
];

export function ThemePicker({ resumeId, activeThemeId, onThemeApplied, onEditTheme }: Props) {
  const [tab, setTab] = useState<TabId>('system');
  const [showImport, setShowImport] = useState(false);

  const { data: systemThemes = [], isLoading: loadingSystem } = useSystemThemes();
  const { data: popularThemes = [], isLoading: loadingPopular } = usePopularThemes(10);
  const { data: myThemes = [], isLoading: loadingMine } = useMyThemes();

  const applyTheme = useApplyTheme();
  const forkTheme = useForkTheme();
  const deleteTheme = useDeleteTheme();
  const submitForApproval = useSubmitForApproval();

  const themes = tab === 'system' ? systemThemes : tab === 'popular' ? popularThemes : myThemes;
  const isLoading =
    tab === 'system' ? loadingSystem : tab === 'popular' ? loadingPopular : loadingMine;

  const handleSelect = async (theme: Theme) => {
    await applyTheme.mutateAsync({ resumeId, themeId: theme.id });
    onThemeApplied?.();
  };

  const handleFork = async (theme: Theme) => {
    const response = await forkTheme.mutateAsync({
      themeId: theme.id,
      name: `${theme.name} (Custom)`,
      description: theme.description ?? '',
    });
    // SDK response: { data: { theme: Theme } }
    const forked = (response?.data as unknown as { theme: Theme })?.theme;
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
    setTab('mine');
    setShowImport(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all',
              tab === id
                ? 'bg-blue-500/15 text-white ring-1 ring-blue-500/30'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowImport(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0A0A0A]/80 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Upload className="h-4 w-4" strokeWidth={1.5} />
        Import JSON Theme
      </button>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
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
          {tab === 'mine' && (
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="group flex h-16 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 transition-colors hover:border-white/20 hover:bg-white/5"
            >
              <Plus className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" strokeWidth={1.5} />
              <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">
                Create New Theme
              </span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && themes.length === 0 && tab !== 'mine' && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0A0A0A]/50 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <Palette className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            {tab === 'popular' ? 'No popular themes yet' : 'No themes available'}
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
