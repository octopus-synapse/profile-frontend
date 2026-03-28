/**
 * SaveButton — primary action button with loading state.
 */

'use client';

import { Check, type LucideIcon } from 'lucide-react';
import { Spinner } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

interface SaveButtonProps {
  isPending?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export function SaveButton({
  isPending = false,
  disabled = false,
  icon: Icon = Check,
  children,
  onClick,
  type = 'button',
  className,
}: SaveButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isPending}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-pf-canvas-emphasis px-4 py-2 text-sm font-medium text-pf-fg-on-emphasis',
        'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {isPending ? <Spinner size="sm" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
