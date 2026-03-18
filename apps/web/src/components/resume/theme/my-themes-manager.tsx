/**
 * My Themes Page Component
 * Manage user's personal themes
 */

'use client';

import { useState } from 'react';
import { useDeleteTheme, useMyThemes, useSubmitForApproval } from '../hooks';
import type { Theme } from '../services/theme.types';
import { JsonImportModal } from './json-import-modal';
import { ThemeCard } from './theme-card';
import { ThemeEditor } from './theme-editor';

interface Props {
  onApply?: (themeId: string) => void;
}

export function MyThemesManager({ onApply }: Props) {
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Hook now returns normalized Theme[] directly
  const { data: themes = [], isLoading } = useMyThemes();
  const deleteTheme = useDeleteTheme();
  const submitForApproval = useSubmitForApproval();

  const handleDelete = async (themeId: string) => {
    await deleteTheme.mutateAsync(themeId);
    setDeleteConfirm(null);
  };

  const handleSubmit = async (themeId: string) => {
    await submitForApproval.mutateAsync(themeId);
  };

  // Show theme editor if editing
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">My Themes</h2>
          <p className="text-muted-foreground text-sm">Create and manage your personal themes</p>
        </div>
        <div className="flex gap-2">
          <ImportButton onClick={() => setShowImportModal(true)} />
          <CreateButton onClick={() => setShowCreateModal(true)} />
        </div>
      </div>

      {/* Themes Grid */}
      {isLoading ? (
        <LoadingGrid />
      ) : themes?.length === 0 ? (
        <EmptyState
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
              <DeleteButton
                onConfirm={() => setDeleteConfirm(theme.id)}
                isOpen={deleteConfirm === theme.id}
                onDelete={() => void handleDelete(theme.id)}
                onCancel={() => setDeleteConfirm(null)}
                isPending={deleteTheme.isPending}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <JsonImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImported={() => setShowImportModal(false)}
      />

      {showCreateModal && (
        <CreateThemeModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

// Sub-components for better organization
function ImportButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted flex items-center gap-2 rounded border px-3 py-2 text-sm"
    >
      <span>📥</span> Import JSON
    </button>
  );
}

function CreateButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded px-3 py-2 text-sm"
    >
      <span>➕</span> New Theme
    </button>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-muted h-48 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState({ onImport, onCreate }: { onImport: () => void; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-4xl">🎨</div>
      <h3 className="mb-2 text-lg font-medium">No Themes Yet</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Create your first theme or import one from JSON
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onImport}
          className="hover:bg-muted rounded border px-4 py-2 text-sm"
        >
          Import JSON
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
        >
          Create Theme
        </button>
      </div>
    </div>
  );
}

interface DeleteButtonProps {
  onConfirm: () => void;
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteButton({ onConfirm, isOpen, onDelete, onCancel, isPending }: DeleteButtonProps) {
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onConfirm}
        className="bg-destructive/10 hover:bg-destructive/20 text-destructive absolute top-2 right-2 rounded p-1.5"
        title="Delete theme"
      >
        🗑️
      </button>
    );
  }

  return (
    <div className="bg-background/90 absolute inset-0 flex items-center justify-center rounded-lg">
      <div className="p-4 text-center">
        <p className="mb-3 font-medium">Delete this theme?</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="hover:bg-muted rounded border px-3 py-1 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground rounded px-3 py-1 text-sm"
          >
            {isPending ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline create theme modal
import { useCreateTheme } from '../hooks';
import { modernPreset } from '../types/presets';

function CreateThemeModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('My New Theme');
  const createTheme = useCreateTheme();

  const handleCreate = async () => {
    await createTheme.mutateAsync({
      name,
      description: '',
      category: 'MODERN',
      styleConfig: modernPreset as unknown as Record<string, unknown>,
    });
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Create New Theme</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2"
          placeholder="Theme name"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-muted rounded border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={!name.trim() || createTheme.isPending}
            className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
          >
            {createTheme.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
