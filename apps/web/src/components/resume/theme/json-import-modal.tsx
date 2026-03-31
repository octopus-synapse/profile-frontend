/**
 * JSON Import Modal
 * Clean modal to import theme from JSON
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useThemesCreateThemeForUser } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { AlertCircle, CheckCircle2, Clipboard, FileJson, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/utils';
import type { ResumeStyleConfig } from '../types/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImported?: (themeId: string) => void;
}

export function JsonImportModal({ isOpen, onClose, onImported }: Props) {
  const { t } = useI18n();
  const [json, setJson] = useState('');
  const [name, setName] = useState('My Custom Theme');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const createMutation = useThemesCreateThemeForUser();

  if (!isOpen) return null;

  const validateJson = (value: string) => {
    setJson(value);
    setError(null);
    setIsValid(false);

    if (!value.trim()) return;

    try {
      const parsed = JSON.parse(value) as Partial<ResumeStyleConfig>;
      if (!parsed.layout && !parsed.colors && !parsed.sections) {
        setError('Must include layout, colors, or sections');
        return;
      }
      setIsValid(true);
    } catch {
      setError('Invalid JSON syntax');
    }
  };

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(json) as Partial<ResumeStyleConfig>;

      const response = await createMutation.mutateAsync({
        data: {
          name,
          description: '',
          category: 'MODERN',
          styleConfig: parsed as Record<string, unknown>,
        },
      });

      const themeData = response?.data?.data as { id?: string } | undefined;
      if (themeData?.id) {
        onImported?.(themeData.id);
      }
      onClose();
      setJson('');
      setName('My Custom Theme');
      setError(null);
      setIsValid(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create theme');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      validateJson(text);
    } catch {
      setError('Failed to read clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <FileJson className="h-5 w-5 text-zinc-300" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {t('resume.theme.jsonImport.title')}
              </h2>
              <p className="text-xs text-zinc-400">{t('resume.theme.jsonImport.description')}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            tone="neutral"
            size="sm"
            iconOnly
            aria-label="Close"
            onPress={onClose}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-auto p-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              {t('resume.theme.jsonImport.themeName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition-colors placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
              placeholder={t('resume.theme.jsonImport.namePlaceholder')}
            />
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">JSON Configuration</label>
              <Button
                type="button"
                variant="link"
                tone="neutral"
                size="xs"
                leftIcon={<Clipboard className="h-3.5 w-3.5" strokeWidth={1.5} />}
                onPress={() => void handlePaste()}
              >
                {t('resume.theme.jsonImport.pasteClipboard')}
              </Button>
            </div>
            <div className="relative">
              <textarea
                value={json}
                onChange={(e) => validateJson(e.target.value)}
                className={cn(
                  'h-56 w-full rounded-lg border bg-white/5 p-4 font-mono text-xs text-zinc-200 transition-colors focus:outline-none',
                  error
                    ? 'border-red-500/50 focus:border-red-500/70'
                    : isValid
                      ? 'border-emerald-500/50 focus:border-emerald-500/70'
                      : 'border-white/10 focus:border-white/20',
                )}
                placeholder={`{
  "layout": {
    "type": "single-column",
    "paperSize": "a4",
    "margins": "normal"
  },
  "tokens": {
    "typography": {
      "fontFamily": { "heading": "inter", "body": "inter" },
      "fontSize": "base",
      "headingStyle": "accent-border"
    },
    "colors": {
      "colors": {
        "primary": "#3B82F6",
        "background": "#FFFFFF",
        "text": { "primary": "#1E293B" }
      }
    }
  }
}`}
                spellCheck={false}
              />
              {/* Validation indicator */}
              {json && (
                <div className="absolute top-3 right-3">
                  {error ? (
                    <AlertCircle className="h-5 w-5 text-red-400" strokeWidth={1.5} />
                  ) : isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                  ) : null}
                </div>
              )}
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                {error}
              </p>
            )}
          </div>

          {/* Help */}
          <div className="rounded-lg bg-white/5 p-4">
            <p className="mb-2 text-xs font-medium text-zinc-300">💡 Design Tokens Structure</p>
            <p className="text-xs leading-relaxed text-zinc-400">
              Your JSON should include{' '}
              <code className="rounded bg-white/10 px-1 text-zinc-300">layout</code>,{' '}
              <code className="rounded bg-white/10 px-1 text-zinc-300">tokens</code> (typography,
              colors, spacing), and optionally{' '}
              <code className="rounded bg-white/10 px-1 text-zinc-300">sections</code>{' '}
              configuration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <Button type="button" variant="outline" tone="neutral" size="sm" onPress={onClose}>
            {t('action.cancel')}
          </Button>
          <Button
            type="button"
            variant="solid"
            tone="neutral"
            size="sm"
            loading={createMutation.isPending}
            disabled={!isValid || !name.trim()}
            leftIcon={<Upload className="h-4 w-4" strokeWidth={1.5} />}
            onPress={() => void handleImport()}
          >
            {t('resume.theme.myThemes.createTheme')}
          </Button>
        </div>
      </div>
    </div>
  );
}
