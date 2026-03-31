'use client';

import { Button } from '@octopus-synapse/profile-ui';
import type { LucideIcon } from 'lucide-react';

interface CommandItemProps {
  icon?: LucideIcon;
  label: string;
  shortcut?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CommandItem({
  icon: Icon,
  label,
  shortcut,
  isSelected,
  onClick,
}: CommandItemProps) {
  return (
    <Button
      type="button"
      variant={isSelected ? 'soft' : 'ghost'}
      tone="neutral"
      size="md"
      fullWidth
      leftIcon={Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} /> : undefined}
      role="option"
      aria-selected={isSelected}
      onPress={onClick}
    >
      <span className="flex flex-1 items-center justify-between gap-3">
        <span className="flex-1 truncate text-left text-sm">{label}</span>
        {shortcut && (
          <kbd className="hidden shrink-0 rounded bg-pf-hover-default px-1.5 py-0.5 text-[10px] font-medium text-pf-fg-subtle sm:inline">
            {shortcut}
          </kbd>
        )}
      </span>
    </Button>
  );
}
