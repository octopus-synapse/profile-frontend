"use client";

/**
 * Toast System
 * Notification system built on Sonner
 */

import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gh-canvas-overlay group-[.toaster]:text-gh-fg-default group-[.toaster]:border-gh-border-default group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-gh-fg-muted",
          actionButton: "group-[.toast]:bg-gh-accent-emphasis group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-gh-canvas-subtle group-[.toast]:text-gh-fg-muted",
          success:
            "group-[.toaster]:border-gh-success-emphasis group-[.toaster]:text-gh-success-fg",
          error: "group-[.toaster]:border-gh-danger-emphasis group-[.toaster]:text-gh-danger-fg",
          warning:
            "group-[.toaster]:border-gh-attention-emphasis group-[.toaster]:text-gh-attention-fg",
          info: "group-[.toaster]:border-gh-accent-emphasis group-[.toaster]:text-gh-accent-fg",
        },
      }}
      {...props}
    />
  );
}

// Helper functions for typed toasts
const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle2 className="text-gh-success-fg h-5 w-5" />,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="text-gh-danger-fg h-5 w-5" />,
    });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="text-gh-attention-fg h-5 w-5" />,
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="text-gh-accent-fg h-5 w-5" />,
    });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

export { Toaster, showToast, toast };
