/**
 * DangerAction — single action row in danger zone.
 */

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export function DangerAction({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onClick,
  disabled,
  destructive,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-red-900/50 bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 text-zinc-400" />
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
      </div>
      <Button
        variant={destructive ? 'destructive' : 'outline'}
        size="sm"
        onClick={onClick}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
