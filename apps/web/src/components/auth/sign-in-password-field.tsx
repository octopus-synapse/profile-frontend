/**
 * SignInPasswordField — password field with visibility toggle and forgot link.
 * Memoized to prevent unnecessary re-renders.
 */

'use client';

import { Button, Input, Label } from '@octopus-synapse/profile-ui';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';

interface SignInPasswordFieldProps {
  label: string;
  forgotPasswordLabel: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SignInPasswordField = memo(function SignInPasswordField({
  label,
  forgotPasswordLabel,
  value,
  onChange,
  disabled = false,
}: SignInPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  const toggleVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <Label
          htmlFor="password"
          className="font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
        >
          {label}
        </Label>
        <LocalizedLink
          href={ROUTES.AUTH.FORGOT_PASSWORD}
          className="font-mono text-[10px] text-cyan-400/80 uppercase hover:text-cyan-400 hover:underline"
        >
          {forgotPasswordLabel}
        </LocalizedLink>
      </div>
      <div className="group relative">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
        </div>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          placeholder="••••••••"
          required
          disabled={disabled}
          className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 disabled:opacity-50"
        />
        <span className="absolute inset-y-0 right-3 flex items-center">
          <Button
            type="button"
            variant="ghost"
            tone="neutral"
            emphasis="low"
            size="xs"
            iconOnly
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onPress={toggleVisibility}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </span>
      </div>
    </div>
  );
});
