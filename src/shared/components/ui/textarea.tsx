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
          "bg-gh-canvas-default border-gh-border-default border",
          "text-gh-fg-default placeholder:text-gh-fg-subtle",
          "ring-offset-gh-canvas-default",
          "focus-visible:ring-gh-accent-emphasis focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
          error && "border-gh-danger-emphasis focus-visible:ring-gh-danger-emphasis",
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
