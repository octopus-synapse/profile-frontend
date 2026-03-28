'use client';

/**
 * VersionHistorySidebar — slide-out panel showing resume version history.
 */

import {
  type ResumeVersionItemDto,
  useResumeVersionGetVersionsNested,
  useResumeVersionRestoreVersionNested,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { History, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { showToast } from '@/shared/components/ui/toast';
import { cn } from '@/shared/utils/cn';
import { RestoreConfirmDialog } from './restore-confirm-dialog';
import { VersionListItem } from './version-list-item';
import { VersionEmptyState, VersionErrorState, VersionSkeleton } from './version-list-states';
import { overlayVariants, panelVariants } from './version-utils';

interface Props {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VersionHistorySidebar({ resumeId, open, onOpenChange }: Props) {
  const { t } = useI18n();
  const versionsQuery = useResumeVersionGetVersionsNested(resumeId);
  const restoreMutation = useResumeVersionRestoreVersionNested();

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmLabel, setConfirmLabel] = useState<string | null>(null);

  const versions =
    (versionsQuery.data?.data?.data?.versions as ResumeVersionItemDto[] | undefined) ?? [];
  const isLoading = versionsQuery.isLoading;
  const error = versionsQuery.error;

  const handleRestore = useCallback(async () => {
    if (!confirmId) return;
    try {
      await restoreMutation.mutateAsync({ resumeId, versionId: confirmId });
      showToast.success(t('resume.versions.restoreSuccess'));
      setConfirmId(null);
      onOpenChange(false);
    } catch {
      showToast.error(t('resume.versions.restoreFailed'), t('resume.versions.restoreFailedDesc'));
    }
  }, [confirmId, restoreMutation, resumeId, onOpenChange, t]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="version-overlay"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => onOpenChange(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="version-panel"
              role="dialog"
              aria-label={t('resume.versions.title')}
              className={cn(
                'fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col',
                'border-l border-white/10 bg-[#030303] shadow-xl',
              )}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">{t('resume.versions.title')}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label={t('resume.versions.close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading && <VersionSkeleton />}
                {error !== undefined && error !== null && <VersionErrorState />}
                {!isLoading && !error && versions.length === 0 && <VersionEmptyState />}
                {!isLoading && !error && versions.length > 0 && (
                  <ul className="divide-y divide-white/5">
                    {versions.map((v: ResumeVersionItemDto) => (
                      <VersionListItem
                        key={v.id}
                        version={v}
                        onRestore={(id, label) => {
                          setConfirmId(id);
                          setConfirmLabel(label);
                        }}
                      />
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-white/10 px-5 py-3">
                <p className="text-xs text-zinc-500">
                  {versions.length === 1
                    ? t('resume.versions.versionCountOne')
                    : t('resume.versions.versionCountOther', { count: versions.length })}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <RestoreConfirmDialog
        versionLabel={confirmLabel}
        isPending={restoreMutation.isPending}
        onConfirm={handleRestore}
        onCancel={() => {
          setConfirmId(null);
          setConfirmLabel(null);
        }}
      />
    </>
  );
}
