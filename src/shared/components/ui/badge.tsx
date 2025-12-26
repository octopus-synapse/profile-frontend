/**
 * Badge Component
 * Small status/label component
 */

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gh-accent-subtle text-gh-accent-fg border border-gh-accent-muted",
        secondary: "bg-gh-canvas-subtle text-gh-fg-muted border border-gh-border-default",
        success: "bg-gh-success-subtle text-gh-success-fg border border-gh-success-muted",
        warning: "bg-gh-attention-subtle text-gh-attention-fg border border-gh-attention-muted",
        danger: "bg-gh-danger-subtle text-gh-danger-fg border border-gh-danger-muted",
        outline: "bg-transparent text-gh-fg-default border border-gh-border-default",
      },
      size: {
        sm: "px-2 py-px text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
