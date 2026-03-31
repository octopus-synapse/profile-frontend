/**
 * CreateThemeModal — modal for creating a new theme.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useThemesCreateThemeForUser } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useState } from 'react';
import { modernPreset } from '../types/presets';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateThemeModal({ onClose, onCreated }: Props) {
  const { t } = useI18n();
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
        <h2 className="mb-4 text-lg font-semibold">{t('resume.theme.myThemes.createNew')}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2"
          placeholder={t('resume.theme.myThemes.namePlaceholder')}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" tone="neutral" size="sm" onPress={onClose}>
            {t('action.cancel')}
          </Button>
          <Button
            type="button"
            variant="solid"
            tone="primary"
            size="sm"
            loading={createMutation.isPending}
            disabled={!name.trim()}
            onPress={() => void handleCreate()}
          >
            {t('action.create')}
          </Button>
        </div>
      </div>
    </div>
  );
}
