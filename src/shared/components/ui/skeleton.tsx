/**
 * Skeleton Component
 * Loading placeholder with pulse animation
 */

import { cn } from "@/shared/utils/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-gh-canvas-subtle animate-pulse rounded-md", className)} {...props} />
  );
}

export { Skeleton };
