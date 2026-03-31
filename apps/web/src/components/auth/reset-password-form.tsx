'use client';

/**
 * Reset Password Form Component
 * Uses centralized error handler for API errors
 */

import { Spinner } from '@octopus-synapse/profile-ui';
import { type ResetPasswordDto, resetPasswordHandle } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { VALIDATION } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { AuthSubmitButton } from './auth-submit-button';
import { SecurePasswordField } from './secure-password-field';
import { SecurityFooter } from './security-footer';

function ResetPasswordFormContent() {
  const t = useT();
  const router = useRouter();
  const { classifyError } = useErrorHandler();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (err: unknown): string => {
    const classified = classifyError(err);
    if (classified.category === 'auth') return t('auth.error.invalidToken');
    if (classified.category === 'network') return t('error.network');
    return t('auth.error.resetFailed');
  };

  useEffect(() => {
    if (!token) setError(t('auth.error.invalidToken'));
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(t('auth.error.invalidToken'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.error.passwordMismatch'));
      return;
    }
    if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      setError(t('auth.error.weakPassword'));
      return;
    }
    if (!VALIDATION.PASSWORD.PATTERN.test(password)) {
      setError(t('auth.error.passwordRequirements'));
      return;
    }

    setIsLoading(true);
    try {
      const dto: ResetPasswordDto = { token, newPassword: password };
      await resetPasswordHandle(dto);
      setSuccess(true);
      setTimeout(() => router.push(ROUTES.AUTH.SIGN_IN), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-xs text-red-400">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{t('auth.error.invalidToken')}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1, x: error ? [0, -4, 4, -4, 4, 0] : 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{t('auth.resetPassword.success')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SecurePasswordField
          id="password"
          label={t('auth.resetPassword.password')}
          value={password}
          onChange={setPassword}
          disabled={success || isLoading}
          required
        />
        <SecurePasswordField
          id="confirmPassword"
          label={t('auth.resetPassword.confirmPassword')}
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={success || isLoading}
          required
        />
        <AuthSubmitButton
          label={t('auth.resetPassword.submit')}
          isLoading={isLoading}
          disabled={success}
        />
        <SecurityFooter />
      </form>
    </motion.div>
  );
}

function ResetPasswordFallback() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Spinner size="lg" />
      <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
        {t('auth.loading.generic')}
      </span>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
