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
        <div className="bg-pf-canvas-subtle mb-4 rounded-full p-4">
          <Icon className="text-pf-fg-muted h-8 w-8" />
        </div>
      )}
      <h3 className="text-pf-fg-default mb-2 text-lg font-medium">{title}</h3>
      {description && <p className="text-pf-fg-muted mb-4 max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
