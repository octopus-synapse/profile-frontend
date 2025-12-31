"use client";

/**
 * Progress Component
 * Progress bar with optional label
 */

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/shared/utils/cn";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showValue?: boolean;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, showValue, ...props }, ref) => (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/5", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-cyan-500 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute top-1/2 right-0 ml-2 -translate-y-1/2 text-xs text-zinc-400">
          {value}%
        </span>
      )}
    </div>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
