'use client';

import { type DictionaryKey, useI18n } from '@profile/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, History, RotateCcw, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import {
  Badge,
  Button,
  Separator,
  Skeleton,
} from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import { cn } from '@/shared/utils/cn';

import {
  type VersionItem,
  useRestoreVersion,
  useResumeVersions,
} from '../hooks/use-resume-versions';

interface VersionHistorySidebarProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MINUTES = 60;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

function formatRelativeTime(
  iso: string,
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string,
): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < MINUTES) return t('resume.versions.justNow');
  if (diffSec < HOURS) {
    const m = Math.floor(diffSec / MINUTES);
    return m === 1 ? t('resume.versions.minuteAgo') : t('resume.versions.minutesAgo', { count: m });
  }
  if (diffSec < DAYS) {
    const h = Math.floor(diffSec / HOURS);
    return h === 1 ? t('resume.versions.hourAgo') : t('resume.versions.hoursAgo', { count: h });
  }
  const d = Math.floor(diffSec / DAYS);
  return d === 1 ? t('resume.versions.dayAgo') : t('resume.versions.daysAgo', { count: d });
}

function VersionSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-6 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyVersions() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <History className="h-10 w-10 text-zinc-600" />
      <p className="text-sm text-zinc-400">{t('resume.versions.noVersions')}</p>
    </div>
  );
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, damping: 30, stiffness: 300 },
  },
  exit: { x: '100%', transition: { duration: 0.2 } },
};

export function VersionHistorySidebar({
  resumeId,
  open,
  onOpenChange,
}: VersionHistorySidebarProps) {
  const { t } = useI18n();
  const { data, isLoading, error } = useResumeVersions(resumeId);
  const restoreVersion = useRestoreVersion(resumeId);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmLabel, setConfirmLabel] = useState('');

  const versions = data ?? [];

  const openConfirm = useCallback(
    (versionId: string, label: string) => {
      setConfirmId(versionId);
      setConfirmLabel(label);
    },
    [],
  );

  const closeConfirm = useCallback(() => setConfirmId(null), []);

  const handleRestore = useCallback(async () => {
    if (!confirmId) return;

    try {
      await restoreVersion.mutateAsync(confirmId);
      showToast.success(t('resume.versions.restoreSuccess'));
      closeConfirm();
      onOpenChange(false);
    } catch {
      showToast.error(t('resume.versions.restoreFailed'), t('resume.versions.restoreFailedDesc'));
    }
  }, [confirmId, restoreVersion, closeConfirm, onOpenChange]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
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

            {/* Panel */}
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
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">
                    {t('resume.versions.title')}
                  </h2>
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading && <VersionSkeleton />}

                {error && (
                  <p className="p-5 text-sm text-red-400">
                    {t('resume.versions.failedLoad')}
                  </p>
                )}

                {!isLoading && !error && versions.length === 0 && (
                  <EmptyVersions />
                )}

                {!isLoading && !error && versions.length > 0 && (
                  <ul className="divide-y divide-white/5">
                    {versions.map((version: VersionItem) => {
                      const label = version.label ?? t('resume.versions.autoSaved');
                      const versionTag = `v${version.versionNumber}`;

                      return (
                        <li
                          key={version.id}
                          className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                        >
                          <Badge
                            variant="secondary"
                            size="sm"
                            shape="rounded"
                          >
                            {versionTag}
                          </Badge>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                              {label}
                            </p>
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <Clock className="h-3 w-3" />
                              {formatRelativeTime(version.createdAt, t)}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="xs"
                            leftIcon={
                              <RotateCcw className="h-3.5 w-3.5" />
                            }
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() =>
                              openConfirm(version.id, versionTag)
                            }
                          >
                            {t('resume.versions.restore')}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 px-5 py-3">
                <p className="text-xs text-zinc-500">
                  {versions.length === 1 ? t('resume.versions.versionCountOne') : t('resume.versions.versionCountOther', { count: versions.length })}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Restore confirmation dialog */}
      <Dialog
        open={confirmId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeConfirm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('resume.versions.restoreConfirmTitle', { version: confirmLabel })}</DialogTitle>
            <DialogDescription>
              {t('resume.versions.restoreConfirmDesc')}
            </DialogDescription>
          </DialogHeader>
          <Separator className="bg-white/10" />
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={closeConfirm}>
              {t('action.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={restoreVersion.isPending}
              onClick={handleRestore}
            >
              {t('resume.versions.restore')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
