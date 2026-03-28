/**
 * CreateThemeModal — modal for creating a new theme.
 */

'use client';

import { useThemesCreateThemeForUser } from '@profile/api-client';
import { useState } from 'react';
import { modernPreset } from '../types/presets';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateThemeModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('My New Theme');
  const createMutation = useThemesCreateThemeForUser();

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      data: {
        name,
        description: '',
        category: 'MODERN',
        styleConfig: modernPreset as unknown as Record<string, unknown>,
      },
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
            disabled={!name.trim() || createMutation.isPending}
            className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
