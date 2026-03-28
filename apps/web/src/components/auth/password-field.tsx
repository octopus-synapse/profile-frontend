/**
 * PasswordField — password input with visibility toggle.
 * Memoized to prevent unnecessary re-renders.
 */

'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  children?: React.ReactNode;
}

export const PasswordField = memo(function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  hasError = false,
  children,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  const toggleVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

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
          <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
        </div>
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required
          autoComplete="new-password"
          error={hasError}
          className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-white"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {children}
    </div>
  );
});
