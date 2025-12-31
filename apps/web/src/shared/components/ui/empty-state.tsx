/**
 * Empty State Component
 * Placeholder for empty content
 */

import { cn } from "@/shared/utils/cn";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-4 py-12 text-center", className)}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-white/5 p-4">
          <Icon className="h-8 w-8 text-zinc-400" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-zinc-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
