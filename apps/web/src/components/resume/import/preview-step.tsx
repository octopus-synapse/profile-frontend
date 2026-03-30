/**
 * PreviewStep — displays parsed data before import confirmation.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import type { ParsedData } from './upload-step';

interface PreviewStepProps {
  data: ParsedData;
  onBack: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function PreviewStep({ data, onBack, onConfirm, isPending }: PreviewStepProps) {
  const { t } = useI18n();
  const rows = [
    { label: 'Name', value: data.basics?.name },
    { label: 'Email', value: data.basics?.email },
    { label: 'Summary', value: data.basics?.summary ? 'Yes' : 'None' },
    { label: 'Work entries', value: data.work?.length ?? 0 },
    { label: 'Education entries', value: data.education?.length ?? 0 },
    { label: 'Skills', value: data.skills?.length ?? 0 },
  ];

  return (
    <div className="space-y-4 p-6 pt-0">
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <dl className="space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <dt className="text-zinc-400">{r.label}</dt>
              <dd className="font-medium text-white">{String(r.value ?? '—')}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> {t('action.back')}
        </Button>
        <Button onClick={onConfirm} disabled={isPending} className="gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isPending ? 'Importing…' : 'Import'}
        </Button>
      </div>
    </div>
  );
}
