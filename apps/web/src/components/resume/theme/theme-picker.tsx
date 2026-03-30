/**
 * Theme Picker
 * Elegant theme selection with tabs
 */

'use client';

import { Button, ConfirmDialog, useConfirmDialog } from '@octopus-synapse/profile-ui';
import {
  useThemesApply,
  useThemesDeleteThemeForUser,
  useThemesFindAllSystemThemes,
  useThemesFindPopularThemes,
  useThemesFork,
  useThemesGetAllThemesByUser,
  useThemesSubmit,
} from '@profile/api-client';
import { Palette, Plus, Sparkles, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import type { Theme } from '../types/config';
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
  const { dialogProps, confirm } = useConfirmDialog();

  const systemQuery = useThemesFindAllSystemThemes();
  const popularQuery = useThemesFindPopularThemes({ limit: 10 });
  const myQuery = useThemesGetAllThemesByUser();

  const systemThemes =
    (systemQuery.data?.data?.data as { themes?: Theme[] } | undefined)?.themes ?? [];
  const popularThemes =
    (popularQuery.data?.data?.data as { themes?: Theme[] } | undefined)?.themes ?? [];
  const myThemes = (myQuery.data?.data?.data as { themes?: Theme[] } | undefined)?.themes ?? [];
  const loadingSystem = systemQuery.isLoading;
  const loadingPopular = popularQuery.isLoading;
  const loadingMine = myQuery.isLoading;

  const applyMutation = useThemesApply();
  const forkMutation = useThemesFork();
  const deleteMutation = useThemesDeleteThemeForUser();
  const submitMutation = useThemesSubmit();

  const getThemesForTab = (tabId: TabId): Theme[] => {
    const themesByTab: Record<TabId, Theme[]> = {
      system: systemThemes,
      popular: popularThemes,
      mine: myThemes,
    };
    return themesByTab[tabId];
  };

  const getLoadingForTab = (tabId: TabId): boolean => {
    const loadingByTab: Record<TabId, boolean> = {
      system: loadingSystem,
      popular: loadingPopular,
      mine: loadingMine,
    };
    return loadingByTab[tabId];
  };

  const themes = getThemesForTab(tab);
  const isLoading = getLoadingForTab(tab);

  const handleSelect = async (theme: Theme) => {
    await applyMutation.mutateAsync({ data: { themeId: theme.id, resumeId } });
    onThemeApplied?.();
  };

  const handleFork = async (theme: Theme) => {
    const response = await forkMutation.mutateAsync({
      data: {
        themeId: theme.id,
        name: `${theme.name} (Custom)`,
        description: theme.description ?? '',
      },
    });
    const forked = response?.data?.data as unknown as Theme | undefined;
    if (forked) {
      onEditTheme?.(forked);
    }
  };

  const handleDelete = async (theme: Theme) => {
    const confirmed = await confirm(
      `Delete "${theme.name}"?`,
      'This theme will be permanently removed.',
      { variant: 'danger', confirmLabel: 'Delete' },
    );
    if (confirmed) {
      await deleteMutation.mutateAsync({ id: theme.id });
    }
  };

  const handleEdit = (theme: Theme) => {
    onEditTheme?.(theme);
  };

  const handleSubmitForApproval = async (theme: Theme) => {
    await submitMutation.mutateAsync({ id: theme.id });
  };

  const handleImported = () => {
    setTab('mine');
    setShowImport(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            type="button"
            variant={tab === id ? 'soft' : 'ghost'}
            tone={tab === id ? 'info' : 'neutral'}
            size="sm"
            leftIcon={<Icon className="h-3 w-3" strokeWidth={1.5} />}
            onPress={() => setTab(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        tone="neutral"
        size="md"
        fullWidth
        leftIcon={<Upload className="h-4 w-4" strokeWidth={1.5} />}
        onPress={() => setShowImport(true)}
      >
        Import JSON Theme
      </Button>

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
            <Button
              type="button"
              variant="ghost"
              tone="neutral"
              size="lg"
              fullWidth
              leftIcon={<Plus className="h-4 w-4" strokeWidth={1.5} />}
              onPress={() => setShowImport(true)}
            >
              Create New Theme
            </Button>
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

      <ConfirmDialog {...dialogProps} />

      {/* Import Modal */}
      <JsonImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImported={handleImported}
      />
    </div>
  );
}
