'use client';

/**
 * Import Upload Step
 *
 * File dropzone and JSON text area for the first step of the import wizard.
 */

import { useI18n } from '@profile/i18n';
import { AlertCircle, Clipboard, FileJson, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utils';

// ============================================================================
// Types
// ============================================================================

interface ParsedData {
  basics?: { name?: string; email?: string; summary?: string };
  work?: unknown[];
  education?: unknown[];
  skills?: unknown[];
}

interface UploadStepProps {
  onParsed: (raw: string, data: ParsedData) => void;
}

// ============================================================================
// Component
// ============================================================================

export function UploadStep({ onParsed }: UploadStepProps) {
  const { t } = useI18n();
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleParse = useCallback(
    (value: string) => {
      setError(null);
      setIsParsing(true);
      if (!value.trim()) {
        setError(t('resume.import.provideJson'));
        setIsParsing(false);
        return;
      }
      try {
        const parsed = JSON.parse(value) as ParsedData;
        onParsed(value, parsed);
      } catch {
        setError(t('resume.import.invalidJson'));
      } finally {
        setIsParsing(false);
      }
    },
    [onParsed, t],
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setJson(text);
      void handleParse(text);
    };
    reader.readAsText(file);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJson(text);
    } catch {
      setError(t('resume.import.failedClipboard'));
    }
  };

  return (
    <div className="space-y-4 p-6 pt-0">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20 hover:bg-white/5"
      >
        <Upload className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />
        <p className="text-sm text-zinc-400">
          {t('resume.import.dropzonePre')}{' '}
          <code className="rounded bg-white/10 px-1 text-zinc-300">.json</code>{' '}
          {t('resume.import.dropzonePost')}
        </p>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-zinc-500">{t('resume.import.orPasteJson')}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">
            {t('resume.import.jsonDataLabel')}
          </label>
          <button
            type="button"
            onClick={() => void handlePaste()}
            className="flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <Clipboard className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t('resume.import.paste')}
          </button>
        </div>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={8}
          className={cn(
            'w-full rounded-lg border bg-white/5 p-4 font-mono text-xs text-zinc-200 transition-colors focus:outline-none',
            error ? 'border-red-500/50' : 'border-white/10 focus:border-white/20',
          )}
          placeholder='{ "basics": { "name": "John Doe", ... } }'
          spellCheck={false}
        />
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => handleParse(json)}
          disabled={!json.trim() || isParsing}
          className="gap-2"
        >
          <FileJson className="h-4 w-4" />
          {t('resume.import.parsePreview')}
        </Button>
      </div>
    </div>
  );
}

export type { ParsedData };
