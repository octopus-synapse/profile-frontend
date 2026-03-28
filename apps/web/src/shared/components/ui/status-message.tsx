/**
 * StatusMessage — reusable success/error/info status indicator.
 */

import { AlertCircle, CheckCircle2, Info, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

type StatusType = 'success' | 'error' | 'info' | 'muted';

interface StatusMessageProps {
  type: StatusType;
  message: string;
  className?: string;
}

const CONFIG: Record<StatusType, { icon: LucideIcon; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-pf-success-fg' },
  error: { icon: AlertCircle, color: 'text-pf-danger-fg' },
  info: { icon: Info, color: 'text-pf-accent-fg' },
  muted: { icon: Info, color: 'text-pf-fg-muted' },
};

export function StatusMessage({ type, message, className }: StatusMessageProps) {
  const { icon: Icon, color } = CONFIG[type];
  return (
    <div className={cn('flex items-center gap-2 text-sm', color, className)}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
