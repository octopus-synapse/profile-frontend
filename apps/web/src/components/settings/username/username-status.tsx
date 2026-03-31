/**
 * UsernameStatus - validation status icons and messages.
 */

import { AlertCircle, Check, Loader2, X } from 'lucide-react';

export interface StatusMessageResult {
  text: string;
  type: 'muted' | 'error' | 'success';
}

interface StatusContext {
  isEditing: boolean;
  hasChanged: boolean;
  isChecking: boolean;
  isValid: boolean;
  touched: boolean;
  validationMessage?: string;
  isAvailable: boolean | null;
}

export function getStatusMessage(ctx: StatusContext): StatusMessageResult | null {
  if (!ctx.isEditing || !ctx.hasChanged) return null;

  if (ctx.isChecking) {
    return { text: 'Checking availability...', type: 'muted' };
  }
  if (!ctx.isValid && ctx.touched) {
    return { text: ctx.validationMessage ?? 'Invalid username', type: 'error' };
  }
  if (ctx.isAvailable === true) {
    return { text: 'Username is available!', type: 'success' };
  }
  if (ctx.isAvailable === false) {
    return { text: 'This username is already taken', type: 'error' };
  }
  return null;
}

export function StatusIcon({ status }: { status: StatusContext }) {
  if (!status.isEditing || !status.hasChanged) return null;

  if (status.isChecking) {
    return <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />;
  }
  if (!status.isValid && status.touched) {
    return <X className="h-4 w-4 text-red-500" />;
  }
  if (status.isAvailable === true) {
    return <Check className="h-4 w-4 text-emerald-500" />;
  }
  if (status.isAvailable === false) {
    return <X className="h-4 w-4 text-red-500" />;
  }
  return null;
}

export function StatusMessage({ message }: { message: StatusMessageResult | null }) {
  if (!message) return null;

  const colorClass =
    message.type === 'error'
      ? 'text-red-500'
      : message.type === 'success'
        ? 'text-emerald-500'
        : 'text-zinc-400';

  return (
    <p className={`mt-1.5 flex items-center gap-1 text-xs ${colorClass}`}>
      {message.type === 'error' && <AlertCircle className="h-3 w-3" />}
      {message.type === 'success' && <Check className="h-3 w-3" />}
      {message.text}
    </p>
  );
}
