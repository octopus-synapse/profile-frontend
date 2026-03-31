/**
 * AuthSubmitButton — primary submit button with shimmer effect.
 */

'use client';

import { Button, Spinner } from '@octopus-synapse/profile-ui';
import { ChevronRight } from 'lucide-react';

interface AuthSubmitButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AuthSubmitButton({
  label,
  isLoading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      className="group relative h-12 w-full overflow-hidden rounded-lg bg-white text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
    >
      {isLoading ? (
        <Spinner size="sm" className="border-black/20 border-t-black" />
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2">
          {label}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      )}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </Button>
  );
}
