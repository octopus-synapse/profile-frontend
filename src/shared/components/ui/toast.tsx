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
            "group toast group-[.toaster]:bg-pf-canvas-overlay group-[.toaster]:text-pf-fg-default group-[.toaster]:border-pf-border-default group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-pf-fg-muted",
          actionButton: "group-[.toast]:bg-pf-accent-emphasis group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-pf-canvas-subtle group-[.toast]:text-pf-fg-muted",
          success:
            "group-[.toaster]:border-pf-success-emphasis group-[.toaster]:text-pf-success-fg",
          error: "group-[.toaster]:border-pf-danger-emphasis group-[.toaster]:text-pf-danger-fg",
          warning:
            "group-[.toaster]:border-pf-attention-emphasis group-[.toaster]:text-pf-attention-fg",
          info: "group-[.toaster]:border-pf-accent-emphasis group-[.toaster]:text-pf-accent-fg",
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
      icon: <CheckCircle2 className="text-pf-success-fg h-5 w-5" />,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="text-pf-danger-fg h-5 w-5" />,
    });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="text-pf-attention-fg h-5 w-5" />,
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="text-pf-accent-fg h-5 w-5" />,
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
