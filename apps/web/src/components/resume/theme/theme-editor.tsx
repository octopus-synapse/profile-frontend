/**
 * Theme Editor
 * Edit theme with live preview
 *
 * NOTE: Color/Layout/Typography/Spacing editors were deleted.
 * Backend should provide a schema and frontend renders a generic form.
 * For now, only JSON editing is available.
 */

'use client';

import {
  useThemesCreateThemeForUser,
  useThemesFork,
  useThemesUpdateThemeForUser,
} from '@profile/api-client';
import { useState } from 'react';
import { showToast } from '@/shared/components/ui/toast';
import { cn } from '@/shared/utils';
import type { ResumeStyleConfig, Theme } from '../types/config';

interface Props {
  theme?: Theme | null;
  onSave?: (theme: Theme) => void;
  onCancel?: () => void;
}

type EditorTab = 'json';

export function ThemeEditor({ theme, onSave, onCancel }: Props) {
  const isNew = !theme;
  const isPublicOrSystem = theme?.status === 'PUBLISHED' || theme?.isSystemTheme;

  const [name, setName] = useState(theme?.name || 'My Custom Theme');
  const [config, setConfig] = useState<Partial<ResumeStyleConfig>>(
    (theme?.styleConfig as Partial<ResumeStyleConfig>) || {},
  );
  const [_tab, setTab] = useState<EditorTab>('json');

  const createMutation = useThemesCreateThemeForUser();
  const updateMutation = useThemesUpdateThemeForUser();
  const forkMutation = useThemesFork();

  const handleSave = async () => {
    try {
      let saved: Theme | undefined;

      if (isNew) {
        const response = await createMutation.mutateAsync({
          data: {
            name,
            description: '',
            category: 'MODERN',
            styleConfig: config as Record<string, unknown>,
          },
        });
        saved = response?.data?.data as unknown as Theme | undefined;
      } else if (isPublicOrSystem && theme) {
        const forkResponse = await forkMutation.mutateAsync({
          data: {
            themeId: theme.id,
            name: `${name} (Custom)`,
            description: theme.description ?? '',
          },
        });
        const forkedTheme = forkResponse?.data?.data as unknown as Theme | undefined;
        if (forkedTheme) {
          const updateResponse = await updateMutation.mutateAsync({
            id: forkedTheme.id,
            data: {
              name: forkedTheme.name,
              description: forkedTheme.description ?? '',
              category: forkedTheme.category,
              tags: forkedTheme.tags,
              styleConfig: config as Record<string, unknown>,
            },
          });
          saved = updateResponse?.data?.data as unknown as Theme | undefined;
        }
      } else if (theme) {
        const response = await updateMutation.mutateAsync({
          id: theme.id,
          data: {
            name,
            description: theme.description ?? '',
            category: theme.category,
            tags: theme.tags,
            styleConfig: config as Record<string, unknown>,
          },
        });
        saved = response?.data?.data as unknown as Theme | undefined;
      }

      if (saved) {
        onSave?.(saved);
      }
    } catch (_error) {
      showToast.error('Failed to save theme');
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-pf-border-default flex items-center justify-between border-b p-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-pf-fg-default hover:border-pf-border-default focus:border-pf-border-emphasis border-b border-transparent bg-transparent text-base font-medium outline-none"
            placeholder="Theme name"
          />
          {isPublicOrSystem && (
            <p className="text-pf-fg-subtle mt-1 text-xs">Editing will create a private copy</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={
              createMutation.isPending || updateMutation.isPending || forkMutation.isPending
            }
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {isPublicOrSystem ? 'Save as Copy' : 'Save'}
          </button>
        </div>
      </div>

      {/* Tabs - Only JSON for now until backend schema is available */}
      <div className="border-pf-border-default flex border-b">
        <button
          type="button"
          onClick={() => setTab('json')}
          className={cn(
            'border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors',
            'border-pf-border-emphasis text-pf-fg-default',
          )}
        >
          JSON
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4">
        <JsonEditor config={config} onChange={setConfig} />
      </div>
    </div>
  );
}

function JsonEditor({
  config,
  onChange,
}: {
  config: Partial<ResumeStyleConfig>;
  onChange: (c: Partial<ResumeStyleConfig>) => void;
}) {
  const [json, setJson] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setJson(value);
    try {
      const parsed = JSON.parse(value) as Partial<ResumeStyleConfig>;
      onChange(parsed);
      setError(null);
    } catch {
      setError('Invalid JSON');
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={json}
        onChange={(e) => handleChange(e.target.value)}
        className="border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default focus:border-pf-border-emphasis focus:ring-pf-neutral-subtle h-96 w-full rounded-lg border p-4 font-mono text-sm focus:ring-2 focus:outline-none"
        spellCheck={false}
      />
      {error && <p className="text-pf-danger-fg text-sm">{error}</p>}
    </div>
  );
}
