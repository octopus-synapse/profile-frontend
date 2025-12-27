"use client";

/**
 * Textarea Component
 * Multi-line text input
 */

import * as React from "react";
import { cn } from "@/shared/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm",
          "bg-pf-canvas-default border-pf-border-default border",
          "text-pf-fg-default placeholder:text-pf-fg-subtle",
          "ring-offset-pf-canvas-default",
          "focus-visible:ring-pf-accent-emphasis focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
          error && "border-pf-danger-emphasis focus-visible:ring-pf-danger-emphasis",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
