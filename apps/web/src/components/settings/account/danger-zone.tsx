'use client';

/**
 * DangerZone — Minimal design
 */

import { Button, showToast } from '@octopus-synapse/profile-ui';
import { authLogout, getAuthSessionQueryKey, userConsentExportData } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Download, Trash2, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
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
          <Button
            type="button"
            variant="outline"
            tone="neutral"
            size="sm"
            loading={isExporting}
            leftIcon={<Download className="h-4 w-4" />}
            onPress={() => void handleExport()}
          >
            {isExporting
              ? t('settings.danger.export.exporting')
              : t('settings.danger.export.button')}
          </Button>
        </ActionRow>

        {/* Deactivate */}
        <ActionRow
          icon={UserX}
          title={t('settings.danger.deactivate.title')}
          description={t('settings.danger.deactivate.description')}
        >
          <Button
            type="button"
            variant="outline"
            tone="warning"
            size="sm"
            leftIcon={<UserX className="h-4 w-4" />}
            onPress={() => setDeactivateOpen(true)}
          >
            {t('settings.danger.deactivate.button')}
          </Button>
        </ActionRow>

        {/* Delete */}
        <ActionRow
          icon={Trash2}
          title={t('settings.danger.delete.title')}
          description={t('settings.danger.delete.description')}
        >
          <Button
            type="button"
            variant="soft"
            tone="danger"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onPress={() => setDeleteOpen(true)}
          >
            {t('settings.danger.delete.button')}
          </Button>
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
