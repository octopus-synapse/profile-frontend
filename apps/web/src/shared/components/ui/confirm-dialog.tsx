'use client';

/**
 * ConfirmDialog — Accessible confirmation modal replacing browser confirm()
 *
 * Built on the existing Radix-based Dialog primitive.
 * Provides both a controlled component and a useConfirmDialog hook
 * for imperative confirm-then-act flows.
 */

import { useCallback, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-pf-border-default px-4 py-2 text-sm font-medium text-pf-fg-muted transition-colors hover:bg-pf-hover-subtle"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              isDanger
                ? 'rounded-lg bg-pf-danger-emphasis px-4 py-2 text-sm font-medium text-pf-fg-on-emphasis transition-colors hover:opacity-90'
                : 'rounded-lg bg-pf-canvas-emphasis px-4 py-2 text-sm font-medium text-pf-fg-on-emphasis transition-colors hover:opacity-90'
            }
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDialogState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: 'danger' | 'default';
}

const CLOSED_STATE: ConfirmDialogState = {
  open: false,
  title: '',
  description: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'default',
};

interface ConfirmOptions {
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

/**
 * Hook for imperative confirm-then-act flows.
 *
 * Usage:
 *   const { dialogProps, confirm } = useConfirmDialog();
 *   const ok = await confirm('Delete?', 'This cannot be undone.', { variant: 'danger' });
 *   if (ok) deleteItem();
 *   // Render <ConfirmDialog {...dialogProps} /> in the component tree
 */
export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState>(CLOSED_STATE);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (title: string, description: string, options?: ConfirmOptions): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        setState({
          open: true,
          title,
          description,
          confirmLabel: options?.confirmLabel ?? 'Confirm',
          cancelLabel: options?.cancelLabel ?? 'Cancel',
          variant: options?.variant ?? 'default',
        });
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    resolverRef.current?.(true);
    resolverRef.current = null;
    setState(CLOSED_STATE);
  }, []);

  const handleCancel = useCallback(() => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setState(CLOSED_STATE);
  }, []);

  const dialogProps: ConfirmDialogProps = {
    open: state.open,
    title: state.title,
    description: state.description,
    confirmLabel: state.confirmLabel,
    cancelLabel: state.cancelLabel,
    variant: state.variant,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  return { dialogProps, confirm };
}
