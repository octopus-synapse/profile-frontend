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
            'group toast group-[.toaster]:bg-[#0A0A0A]/95 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-zinc-400',
          actionButton: 'group-[.toast]:bg-cyan-500 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-white/5 group-[.toast]:text-zinc-400',
          success: 'group-[.toaster]:border-emerald-500 group-[.toaster]:text-emerald-500',
          error: 'group-[.toaster]:border-red-500 group-[.toaster]:text-red-500',
          warning: 'group-[.toaster]:border-amber-500 group-[.toaster]:text-amber-500',
          info: 'group-[.toaster]:border-cyan-500 group-[.toaster]:text-cyan-400',
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
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="h-5 w-5 text-cyan-400" />,
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
