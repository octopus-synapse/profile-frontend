/**
 * VersionListItem — single version entry with restore button.
 */

'use client';

import type { ResumeVersionItemDto } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Clock, RotateCcw } from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import { formatRelativeTime } from './version-utils';

interface Props {
  version: ResumeVersionItemDto;
  onRestore: (versionId: string, label: string) => void;
}

export function VersionListItem({ version, onRestore }: Props) {
  const { t } = useI18n();
  const label = version.label ?? t('resume.versions.autoSaved');
  const versionTag = `v${version.versionNumber}`;

  return (
    <li className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]">
      <Badge variant="secondary" size="sm" shape="rounded">
        {versionTag}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{label}</p>
        <span className="flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(version.createdAt, t)}
        </span>
      </div>
      <Button
        variant="ghost"
        size="xs"
        leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onRestore(version.id, versionTag)}
      >
        {t('resume.versions.restore')}
      </Button>
    </li>
  );
}
