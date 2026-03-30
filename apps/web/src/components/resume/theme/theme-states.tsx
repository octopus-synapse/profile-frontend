/**
 * ThemeStates — loading, empty, and delete confirmation states.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';

export function ThemeLoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-muted h-48 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  onImport: () => void;
  onCreate: () => void;
}

export function ThemeEmptyState({ onImport, onCreate }: EmptyStateProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-4xl">🎨</div>
      <h3 className="mb-2 text-lg font-medium">{t('resume.theme.myThemes.noThemes')}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        {t('resume.theme.myThemes.noThemesDesc')}
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" tone="neutral" size="sm" onPress={onImport}>
          {t('resume.theme.myThemes.importJson')}
        </Button>
        <Button type="button" variant="solid" tone="primary" size="sm" onPress={onCreate}>
          {t('resume.theme.myThemes.createTheme')}
        </Button>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  onConfirm: () => void;
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ThemeDeleteConfirm({
  onConfirm,
  isOpen,
  onDelete,
  onCancel,
  isPending,
}: DeleteConfirmProps) {
  const { t } = useI18n();

  if (!isOpen) {
    return (
      <span className="absolute top-2 right-2">
        <Button
          type="button"
          variant="soft"
          tone="danger"
          size="xs"
          iconOnly
          aria-label={t('resume.theme.myThemes.deleteTheme')}
          onPress={onConfirm}
        >
          🗑️
        </Button>
      </span>
    );
  }

  return (
    <div className="bg-background/90 absolute inset-0 flex items-center justify-center rounded-lg">
      <div className="p-4 text-center">
        <p className="mb-3 font-medium">{t('resume.theme.myThemes.deleteConfirm')}</p>
        <div className="flex justify-center gap-2">
          <Button type="button" variant="outline" tone="neutral" size="xs" onPress={onCancel}>
            {t('action.cancel')}
          </Button>
          <Button
            type="button"
            variant="solid"
            tone="danger"
            size="xs"
            loading={isPending}
            onPress={onDelete}
          >
            {t('action.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
