'use client';

import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SectionVisibilityToggleProps {
  resumeId: string;
  sectionId: string;
  visible: boolean;
  label: string;
  onToggle: (sectionId: string, visible: boolean) => Promise<void>;
}

export function SectionVisibilityToggle({
  sectionId,
  visible,
  label,
  onToggle,
}: SectionVisibilityToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const [optimisticVisible, setOptimisticVisible] = useState(visible);

  const handleToggle = async () => {
    const newValue = !optimisticVisible;
    setOptimisticVisible(newValue);
    setIsPending(true);
    try {
      await onToggle(sectionId, newValue);
    } catch {
      setOptimisticVisible(!newValue);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
      aria-label={`${optimisticVisible ? 'Hide' : 'Show'} ${label}`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
      ) : optimisticVisible ? (
        <Eye className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
      ) : (
        <EyeOff className="h-4 w-4 text-zinc-400" />
      )}
      <span className={optimisticVisible ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 line-through'}>
        {label}
      </span>
    </button>
  );
}
