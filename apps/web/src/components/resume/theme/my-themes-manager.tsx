/**
 * MyThemesManager — manage user's personal themes.
 */

'use client';

import {
  useThemesDeleteThemeForUser,
  useThemesGetAllThemesByUser,
  useThemesSubmit,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useState } from 'react';
import type { Theme } from '../types/config';
import { CreateThemeModal } from './create-theme-modal';
import { JsonImportModal } from './json-import-modal';
import { CreateButton, ImportButton } from './theme-action-buttons';
import { ThemeCard } from './theme-card';
import { ThemeEditor } from './theme-editor';
import { ThemeDeleteConfirm, ThemeEmptyState, ThemeLoadingGrid } from './theme-states';

interface Props {
  onApply?: (themeId: string) => void;
}

export function MyThemesManager({ onApply }: Props) {
  const { t } = useI18n();
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const themesQuery = useThemesGetAllThemesByUser();
  const themes = (themesQuery.data?.data?.data as { themes?: Theme[] } | undefined)?.themes ?? [];
  const isLoading = themesQuery.isLoading;
  const deleteMutation = useThemesDeleteThemeForUser();
  const submitMutation = useThemesSubmit();

  const handleDelete = async (themeId: string) => {
    await deleteMutation.mutateAsync({ id: themeId });
    setDeleteConfirm(null);
  };
  const handleSubmit = async (themeId: string) => {
    await submitMutation.mutateAsync({ id: themeId });
  };

  if (editingTheme) {
    return (
      <ThemeEditor
        theme={editingTheme}
        onSave={() => setEditingTheme(null)}
        onCancel={() => setEditingTheme(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t('resume.theme.myThemes.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('resume.theme.myThemes.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <ImportButton onClick={() => setShowImportModal(true)} />
          <CreateButton onClick={() => setShowCreateModal(true)} />
        </div>
      </div>

      {isLoading ? (
        <ThemeLoadingGrid />
      ) : themes?.length === 0 ? (
        <ThemeEmptyState
          onImport={() => setShowImportModal(true)}
          onCreate={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themes?.map((theme) => (
            <div key={theme.id} className="relative">
              <ThemeCard
                theme={theme}
                onSelect={() => onApply?.(theme.id)}
                onEdit={() => setEditingTheme(theme)}
                onSubmitForApproval={() => void handleSubmit(theme.id)}
              />
              <ThemeDeleteConfirm
                onConfirm={() => setDeleteConfirm(theme.id)}
                isOpen={deleteConfirm === theme.id}
                onDelete={() => void handleDelete(theme.id)}
                onCancel={() => setDeleteConfirm(null)}
                isPending={deleteMutation.isPending}
              />
            </div>
          ))}
        </div>
      )}

      <JsonImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImported={() => setShowImportModal(false)}
      />
      {showCreateModal && (
        <CreateThemeModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
