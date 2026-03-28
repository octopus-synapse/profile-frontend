/**
 * EmailField — email input with icon.
 * Memoized to prevent unnecessary re-renders.
 */

'use client';

import { Mail } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';

interface EmailFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const EmailField = memo(function EmailField({
  id = 'email',
  label,
  value,
  onChange,
  placeholder = 'name@company.com',
  disabled = false,
  required = false,
}: EmailFieldProps) {
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
          <Mail className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
        </div>
        <Input
          id={id}
          type="email"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="h-11 border-white/10 bg-white/[0.02] pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 disabled:opacity-50"
        />
      </div>
    </div>
  );
});
