'use client';

/**
 * DangerZone — Minimal design
 */

import { authLogout, getAuthSessionQueryKey, userConsentExportData } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Download, Loader2, Trash2, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { showToast } from '@/shared/components/ui/toast';
import { DeactivateDialog } from './deactivate-dialog';
import { DeleteDialog } from './delete-dialog';

export function DangerZone() {
  const { t } = useI18n();
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearSessionAndRedirect = useCallback(
    async (path: string) => {
      await authLogout({});
      await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
      router.replace(path);
    },
    [queryClient, router],
  );

  async function handleExport() {
    setIsExporting(true);
    try {
      const response = await userConsentExportData();
      const data = response.data?.data;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast.success(t('settings.danger.export.success'));
    } catch {
      showToast.error(t('settings.danger.export.error'));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-light text-white">{t('settings.danger.title')}</h2>
        <p className="mt-1 text-[13px] text-zinc-500">{t('settings.danger.description')}</p>
      </div>

      {/* Actions */}
      <div className="space-y-6 border-t border-zinc-800/50 pt-8">
        {/* Export */}
        <ActionRow
          icon={Download}
          title={t('settings.danger.export.title')}
          description={t('settings.danger.export.description')}
        >
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-[13px] text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isExporting ? t('settings.danger.export.exporting') : t('settings.danger.export.button')}</span>
          </button>
        </ActionRow>

        {/* Deactivate */}
        <ActionRow
          icon={UserX}
          title={t('settings.danger.deactivate.title')}
          description={t('settings.danger.deactivate.description')}
        >
          <button
            type="button"
            onClick={() => setDeactivateOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-[13px] text-zinc-300 transition-colors hover:border-amber-600/50 hover:text-amber-400"
          >
            <UserX className="h-4 w-4" />
            <span>{t('settings.danger.deactivate.button')}</span>
          </button>
        </ActionRow>

        {/* Delete */}
        <ActionRow
          icon={Trash2}
          title={t('settings.danger.delete.title')}
          description={t('settings.danger.delete.description')}
        >
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-2 text-[13px] text-red-400 transition-colors hover:border-red-800 hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('settings.danger.delete.button')}</span>
          </button>
        </ActionRow>
      </div>

      <DeactivateDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        onSuccess={() => clearSessionAndRedirect('/auth/sign-in')}
      />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => clearSessionAndRedirect('/')}
      />
    </div>
  );
}

function ActionRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Download;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-8">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900">
          <Icon className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <p className="mt-0.5 text-[12px] text-zinc-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
