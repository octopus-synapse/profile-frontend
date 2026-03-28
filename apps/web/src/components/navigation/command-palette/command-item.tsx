'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isSelected
          ? 'bg-pf-hover-default text-pf-fg-default'
          : 'text-pf-fg-muted hover:bg-pf-hover-subtle hover:text-pf-fg-default',
      )}
      role="option"
      aria-selected={isSelected}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />}
      <span className="flex-1 truncate text-sm">{label}</span>
      {shortcut && (
        <kbd className="hidden shrink-0 rounded bg-pf-hover-default px-1.5 py-0.5 text-[10px] font-medium text-pf-fg-subtle sm:inline">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
