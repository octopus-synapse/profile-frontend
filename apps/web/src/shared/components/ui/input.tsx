import * as React from "react";
import { cn } from "@/shared/utils";

/**
 * Input Component
 * GitHub + Cursor inspired design
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    const hasIcon = leftIcon || rightIcon;

    if (hasIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="text-pf-fg-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "bg-pf-canvas-default text-pf-fg-default flex h-9 w-full rounded-md border px-3 py-2 text-sm",
              "transition-all duration-150",
              "placeholder:text-pf-fg-subtle",
              "focus:ring-offset-pf-canvas-default focus:ring-2 focus:ring-offset-1 focus:outline-none",
              "disabled:bg-pf-canvas-subtle disabled:cursor-not-allowed disabled:opacity-60",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-pf-danger-emphasis focus:border-pf-danger-fg focus:ring-pf-danger-muted"
                : "border-pf-border-default focus:border-pf-accent-fg focus:ring-pf-accent-muted",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="text-pf-fg-muted pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "bg-pf-canvas-default text-pf-fg-default flex h-9 w-full rounded-md border px-3 py-2 text-sm",
          "transition-all duration-150",
          "placeholder:text-pf-fg-subtle",
          "focus:ring-offset-pf-canvas-default focus:ring-2 focus:ring-offset-1 focus:outline-none",
          "disabled:bg-pf-canvas-subtle disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-pf-danger-emphasis focus:border-pf-danger-fg focus:ring-pf-danger-muted"
            : "border-pf-border-default focus:border-pf-accent-fg focus:ring-pf-accent-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
