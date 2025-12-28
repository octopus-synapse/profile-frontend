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
        default: "bg-pf-accent-subtle text-pf-accent-fg border border-pf-accent-muted",
        secondary: "bg-pf-canvas-subtle text-pf-fg-muted border border-pf-border-default",
        success: "bg-pf-success-subtle text-pf-success-fg border border-pf-success-muted",
        warning: "bg-pf-attention-subtle text-pf-attention-fg border border-pf-attention-muted",
        danger: "bg-pf-danger-subtle text-pf-danger-fg border border-pf-danger-muted",
        outline: "bg-transparent text-pf-fg-default border border-pf-border-default",
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
