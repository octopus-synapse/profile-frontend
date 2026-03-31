'use client';

/**
 * Sign Up Form Component
 * Uses SDK hooks directly per CLAUDE.md guidelines
 */

import { Button } from '@octopus-synapse/profile-ui';
import { useAccountsSignup } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { ChevronRight, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormErrorAlert } from './form-error-alert';
import { FormField } from './form-field';
import { PasswordField } from './password-field';
import { PasswordStrengthIndicator } from './password-strength-indicator';

export function SignUpForm() {
  const t = useT();
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // SDK mutation
  const signupMutation = useAccountsSignup();

  const isLoading = signupMutation.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signupMutation.mutateAsync({
        data: { name, email, password },
      });

      router.push('/auth/verify-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <FormErrorAlert message={error} />

      <FormField
        id="name"
        label={t('auth.signUp.name')}
        type="text"
        value={name}
        onChange={setName}
        placeholder={t('auth.signUp.namePlaceholder')}
        icon={User}
        autoComplete="name"
        required
      />

      <FormField
        id="email"
        label={t('auth.signUp.email')}
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={Mail}
        autoComplete="email"
        required
        hasError={!!error}
      />

      <PasswordField
        id="password"
        label={t('auth.signUp.password')}
        value={password}
        onChange={setPassword}
        hasError={!!error}
      >
        <PasswordStrengthIndicator password={password} />
        <p className="ml-1 font-mono text-[10px] text-zinc-600">{t('auth.signUp.passwordHint')}</p>
      </PasswordField>

      <PasswordField
        id="confirmPassword"
        label={t('auth.signUp.confirmPassword')}
        value={confirmPassword}
        onChange={setConfirmPassword}
        hasError={!!error}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="group relative mt-6 h-12 w-full overflow-hidden rounded-lg bg-white text-sm font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="font-mono text-xs">{t('auth.loading.creatingAccount')}</span>
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-2">
            {t('auth.signUp.submit')}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </Button>
    </form>
  );
}
