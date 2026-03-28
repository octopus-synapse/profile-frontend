/**
 * SecurePasswordField — reusable password input with toggle visibility.
 * Used by reset-password-form and sign-up-form.
 */

'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';

interface SecurePasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function SecurePasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  disabled = false,
  required = false,
}: SecurePasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-white disabled:opacity-50"
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
