import * as React from "react";
import { cn } from "@/shared/utils";

/**
 * Input component
 * GitHub-inspired design
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, type, error, ...props }, ref) => {
  return (
   <input
    type={type}
    className={cn(
     "flex h-9 w-full rounded-md border bg-zinc-900 px-3 py-1 text-sm text-zinc-100 shadow-sm transition-colors",
     "placeholder:text-zinc-500",
     "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
     "disabled:cursor-not-allowed disabled:opacity-50",
     error
      ? "border-red-500 focus-visible:ring-red-500"
      : "border-zinc-700 focus-visible:ring-blue-500",
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
