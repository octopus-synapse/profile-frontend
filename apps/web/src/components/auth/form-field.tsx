/**
 * FormField — reusable form input with icon and label.
 * Memoized to prevent unnecessary re-renders.
 */

'use client';

import type { LucideIcon } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';

interface Props {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: LucideIcon;
  autoComplete?: string;
  required?: boolean;
  hasError?: boolean;
  rightElement?: React.ReactNode;
}

export const FormField = memo(function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  required = false,
  hasError = false,
  rightElement,
}: Props) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
      >
        {label}
      </Label>
      <div className="group relative">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <Icon className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
        </div>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          error={hasError}
          className={`h-11 border-white/10 bg-white/[0.02] pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 ${rightElement ? 'pr-10' : ''}`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center">{rightElement}</div>
        )}
      </div>
    </div>
  );
});
