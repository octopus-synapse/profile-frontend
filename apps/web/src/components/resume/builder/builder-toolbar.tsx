/**
 * BuilderToolbar — header toolbar for resume builder.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { Check, Download, FileText, Link2 } from 'lucide-react';

interface Props {
  resumeName: string;
  copied: boolean;
  hasResumeId: boolean;
  onExport: () => void;
  onShare: () => void;
}

export function BuilderToolbar({ resumeName, copied, hasResumeId, onExport, onShare }: Props) {
  const { t } = useI18n();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-pf-border-default bg-pf-canvas-subtle px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-hover-subtle ring-1 ring-pf-border-default">
          <FileText className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-pf-fg-default">
            {resumeName || t('resume.builder.untitledResume')}
          </h1>
          <p className="text-xs text-pf-fg-subtle">{t('resume.builder.preview')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-pf-border-default bg-pf-hover-subtle px-3.5 text-sm font-medium text-pf-fg-muted transition-all hover:bg-pf-hover-default hover:text-pf-fg-default"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          {t('action.export')}
        </button>

        <div className="mx-1 h-5 w-px bg-pf-border-default" />

        {hasResumeId && (
          <button
            type="button"
            onClick={onShare}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-pf-canvas-emphasis px-4 text-sm font-semibold text-pf-fg-on-emphasis transition-all hover:bg-pf-accent-fg"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" strokeWidth={1.5} />
                {t('resume.builder.copied')}
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" strokeWidth={1.5} />
                {t('resume.builder.share')}
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
