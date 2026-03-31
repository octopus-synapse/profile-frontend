/**
 * Version sidebar utilities — time formatting and animation variants.
 */

import type { DictionaryKey } from '@profile/i18n';

const MINUTES = 60;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export function formatRelativeTime(
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

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { duration: 0.2 } },
};
