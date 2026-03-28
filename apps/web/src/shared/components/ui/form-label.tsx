/**
 * FormLabel — labeled form field with optional icon.
 */

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface FormLabelProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function FormLabel({ icon: Icon, children, htmlFor, className }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-2 flex items-center gap-2 text-sm font-medium text-pf-fg-default',
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4 text-pf-fg-muted" />}
      {children}
    </label>
  );
}
