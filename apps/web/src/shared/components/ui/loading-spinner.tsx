/**
 * Loading Spinner Component
 * Reusable loading state component
 */

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className={`animate-spin text-zinc-400 ${sizeClasses[size]} ${className || ""}`} />
    </div>
  );
}
