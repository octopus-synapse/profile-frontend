'use client';

import { Button } from '@octopus-synapse/profile-ui';
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
    <span className={cn('block w-full max-w-md', className)}>
      <Button
        type="button"
        variant="outline"
        tone="neutral"
        size="md"
        fullWidth
        leftIcon={<Search className="h-4 w-4 shrink-0" strokeWidth={1.5} />}
        aria-label={t('nav.aria.openCommandPalette')}
        onPress={onClick}
      >
        <span className="flex flex-1 items-center justify-between gap-3">
          <span className="text-left text-sm text-pf-fg-subtle">{t('nav.search.placeholder')}</span>
          <kbd className="hidden items-center gap-1 rounded-md border border-pf-border-default bg-pf-hover-subtle px-2 py-0.5 text-[11px] font-medium text-pf-fg-subtle sm:flex">
            <span className="text-[13px]">⌘</span>K
          </kbd>
        </span>
      </Button>
    </span>
  );
}
