'use client';

import { useI18n } from '@profile/i18n';
import { Search } from 'lucide-react';
import { cn } from '@/shared/utils';

interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-4 py-2',
        'border border-pf-border-default bg-pf-hover-subtle transition-all duration-200',
        'hover:border-pf-border-default hover:bg-pf-hover-default',
        'focus:outline-none focus:ring-2 focus:ring-pf-accent-emphasis/50',
        'w-full max-w-md',
        className,
      )}
      aria-label={t('nav.aria.openCommandPalette')}
    >
      <Search className="h-4 w-4 shrink-0 text-pf-fg-subtle" strokeWidth={1.5} />
      <span className="flex-1 text-left text-sm text-pf-fg-subtle">
        {t('nav.search.placeholder')}
      </span>
      <kbd
        className={cn(
          'hidden items-center gap-1 rounded-md px-2 py-0.5 sm:flex',
          'bg-pf-hover-subtle text-[11px] font-medium text-pf-fg-subtle',
          'border border-pf-border-default',
        )}
      >
        <span className="text-[13px]">⌘</span>K
      </kbd>
    </button>
  );
}
