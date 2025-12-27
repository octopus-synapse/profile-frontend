import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";

/**
 * Button Component
 * GitHub + Cursor inspired design system
 *
 * Variants:
 * - primary: Green CTA button (GitHub style)
 * - secondary: Subtle dark button
 * - outline: Bordered transparent button
 * - ghost: Minimal hover effect
 * - danger: Red destructive action
 * - link: Text link style
 */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md text-sm font-medium",
    "transition-all duration-150 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary - GitHub green CTA
        primary: [
          "bg-pf-success-emphasis text-pf-fg-on-emphasis",
          "border border-pf-border-subtle",
          "hover:bg-[#2ea043]",
          "focus-visible:ring-pf-success-fg focus-visible:ring-offset-pf-canvas-default",
          "shadow-sm",
        ].join(" "),

        // Secondary - Subtle button
        secondary: [
          "bg-pf-canvas-subtle text-pf-fg-default",
          "border border-pf-border-default",
          "hover:bg-pf-border-muted hover:border-pf-border-default",
          "focus-visible:ring-pf-accent-fg focus-visible:ring-offset-pf-canvas-default",
        ].join(" "),

        // Outline - Transparent with border
        outline: [
          "bg-transparent text-pf-fg-default",
          "border border-pf-border-default",
          "hover:bg-pf-canvas-subtle hover:border-pf-fg-muted",
          "focus-visible:ring-pf-accent-fg focus-visible:ring-offset-pf-canvas-default",
        ].join(" "),

        // Ghost - Minimal
        ghost: [
          "bg-transparent text-pf-fg-muted",
          "hover:bg-pf-canvas-subtle hover:text-pf-fg-default",
          "focus-visible:ring-pf-accent-fg focus-visible:ring-offset-pf-canvas-default",
        ].join(" "),

        // Danger - Destructive actions
        danger: [
          "bg-pf-canvas-subtle text-pf-danger-fg",
          "border border-pf-danger-muted",
          "hover:bg-pf-danger-emphasis hover:text-pf-fg-on-emphasis hover:border-pf-danger-emphasis",
          "focus-visible:ring-pf-danger-fg focus-visible:ring-offset-pf-canvas-default",
        ].join(" "),

        // Link - Text style
        link: [
          "bg-transparent text-pf-accent-fg",
          "underline-offset-4 hover:underline",
          "focus-visible:ring-pf-accent-fg focus-visible:ring-offset-pf-canvas-default",
          "p-0 h-auto",
        ].join(" "),
      },
      size: {
        sm: "h-7 px-3 text-xs rounded",
        md: "h-8 px-4 text-sm",
        lg: "h-10 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-8 w-8 p-0",
        "icon-sm": "h-7 w-7 p-0",
        "icon-lg": "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children || "Loading..."}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
