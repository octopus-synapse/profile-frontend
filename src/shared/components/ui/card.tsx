import * as React from "react";
import { cn } from "@/shared/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Card Component
 * Developer-inspired design with sharp edges
 */

const cardVariants = cva("border text-pf-fg-default transition-all duration-150", {
  variants: {
    variant: {
      // Default - Standard card
      default: "border-pf-border-default bg-pf-canvas-overlay",
      // Muted - Subtle background
      muted: "border-pf-border-default bg-pf-canvas-subtle",
      // Outline - Transparent
      outline: "border-pf-border-default bg-transparent",
      // Subtle - Minimal
      subtle: "border-pf-border-muted bg-pf-canvas-subtle/50",
      // Elevated - With shadow
      elevated: "border-pf-border-default bg-pf-canvas-overlay shadow-lg",
      // Interactive - Hover effects
      interactive: [
        "border-pf-border-default bg-pf-canvas-overlay",
        "hover:border-pf-border-emphasis",
        "cursor-pointer",
      ].join(" "),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border-pf-border-default flex flex-col space-y-1.5 border-b px-4 py-3",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-pf-fg-default text-base font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-pf-fg-muted text-sm", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-pf-border-default flex items-center border-t px-4 py-3", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
