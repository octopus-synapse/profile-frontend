/**
 * BuilderToolbar — header toolbar for resume builder.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
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
        <Button
          type="button"
          variant="outline"
          tone="neutral"
          size="sm"
          leftIcon={<Download className="h-4 w-4" strokeWidth={1.5} />}
          onPress={onExport}
        >
          {t('action.export')}
        </Button>

        <div className="mx-1 h-5 w-px bg-pf-border-default" />

        {hasResumeId && (
          <Button
            type="button"
            variant="solid"
            tone="primary"
            size="sm"
            leftIcon={
              copied ? (
                <Check className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Link2 className="h-4 w-4" strokeWidth={1.5} />
              )
            }
            onPress={onShare}
          >
            {copied ? t('resume.builder.copied') : t('resume.builder.share')}
          </Button>
        )}
      </div>
    </header>
  );
}
