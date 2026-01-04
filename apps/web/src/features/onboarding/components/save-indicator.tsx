/**
 * Save Indicator Component
 * Shows the current save status to the user
 *
 * FIX #1.3: Visual feedback for save status
 */

"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SaveIndicatorProps {
  isSaving?: boolean;
  lastSavedAt?: Date | null;
  error?: Error | null;
  onRetry?: () => void;
}

export function SaveIndicator({
  isSaving = false,
  lastSavedAt = null,
  error = null,
  onRetry,
}: SaveIndicatorProps) {
  // Error state (highest priority)
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="h-4 w-4" strokeWidth={2} />
        <span className="font-mono text-xs">Erro ao salvar</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-mono text-xs underline transition-colors hover:text-red-400"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  // Saving state
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-blue-500">
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
        <span className="font-mono text-xs">Salvando...</span>
      </div>
    );
  }

  // Saved state (show for a few seconds)
  if (lastSavedAt) {
    const timeAgo = formatDistanceToNow(lastSavedAt, {
      locale: ptBR,
      addSuffix: true,
    });

    return (
      <div className="flex items-center gap-2 text-emerald-500">
        <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
        <span className="font-mono text-xs">Salvo {timeAgo}</span>
      </div>
    );
  }

  // No state (nothing to show)
  return null;
}
