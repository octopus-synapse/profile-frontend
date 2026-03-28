'use client';

/**
 * Toast System
 * Notification system built on Sonner
 */

import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-pf-canvas-subtle/95 group-[.toaster]:text-pf-fg-default group-[.toaster]:border-pf-border-default group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-pf-fg-muted',
          actionButton:
            'group-[.toast]:bg-pf-accent-emphasis group-[.toast]:text-pf-fg-on-emphasis',
          cancelButton: 'group-[.toast]:bg-pf-hover-subtle group-[.toast]:text-pf-fg-muted',
          success: 'group-[.toaster]:border-pf-success-fg group-[.toaster]:text-pf-success-fg',
          error: 'group-[.toaster]:border-pf-danger-fg group-[.toaster]:text-pf-danger-fg',
          warning: 'group-[.toaster]:border-pf-attention-fg group-[.toaster]:text-pf-attention-fg',
          info: 'group-[.toaster]:border-pf-accent-emphasis group-[.toaster]:text-pf-accent-fg',
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
      icon: <CheckCircle2 className="h-5 w-5 text-pf-success-fg" />,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="h-5 w-5 text-pf-danger-fg" />,
    });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="h-5 w-5 text-pf-attention-fg" />,
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="h-5 w-5 text-pf-accent-fg" />,
    });
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(promise, messages);
  },
};

export { Toaster, showToast, toast };
