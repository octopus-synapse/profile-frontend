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
        'border border-white/10 bg-white/5 transition-all duration-200',
        'hover:border-white/20 hover:bg-white/10',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
        'w-full max-w-md',
        className,
      )}
      aria-label={t('nav.aria.openCommandPalette')}
    >
      <Search className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.5} />
      <span className="flex-1 text-left text-sm text-zinc-500">{t('nav.search.placeholder')}</span>
      <kbd
        className={cn(
          'hidden items-center gap-1 rounded-md px-2 py-0.5 sm:flex',
          'bg-white/5 text-[11px] font-medium text-zinc-500',
          'border border-white/10',
        )}
      >
        <span className="text-[13px]">⌘</span>K
      </kbd>
    </button>
  );
}
