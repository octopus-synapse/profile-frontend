/**
 * Empty State Component
 * Placeholder for empty content
 */

import { cn } from "@/shared/utils/cn";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "dashed";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  description,
  action,
  actionLabel,
  onAction,
  variant = "default",
  className,
}: EmptyStateProps) {
  const displayMessage = message || title || "";
  const displayDescription = description;

  if (variant === "dashed") {
    return (
      <div className={cn("rounded-xl border border-dashed border-white/10 p-10 text-center", className)}>
        {Icon && <Icon className="mx-auto h-10 w-10 text-zinc-500" strokeWidth={1} />}
        <p className="mt-3 text-sm text-zinc-400">{displayMessage}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-4 text-sm font-medium text-white underline-offset-4 hover:underline"
          >
            {actionLabel}
          </button>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center px-4 py-12 text-center", className)}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-white/5 p-4">
          <Icon className="h-8 w-8 text-zinc-400" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-medium text-white">{displayMessage}</h3>
      {displayDescription && <p className="mb-4 max-w-sm text-sm text-zinc-400">{displayDescription}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
