'use client';

/**
 * Reset Password Form Component
 * Ultra Premium Version - Inspired by Linear, Vercel & Cursor
 */

import { useT } from '@profile/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronRight, Eye, EyeOff, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { VALIDATION } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { Button, Input, Spinner } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';
import { apiClient } from '@/shared/lib/api-client';

function ResetPasswordFormContent() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('auth.error.invalidToken'));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(t('auth.error.invalidToken'));
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t('auth.error.passwordMismatch'));
      return;
    }

    // Validate password strength - align with backend requirements
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
      // Use shared api-client
      await apiClient.auth.resetPassword({ token, newPassword: password });
      setSuccess(true);
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.AUTH.SIGN_IN);
      }, 2000);
    } catch (err) {
      // Check for invalid token error
      const errorMessage = err instanceof Error ? err.message : '';
      if (
        errorMessage.includes('401') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('expired')
      ) {
        setError(t('auth.error.invalidToken'));
      } else {
        setError(t('auth.error.resetFailed'));
      }
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
      animate={{
        opacity: 1,
        scale: 1,
        x: error ? [0, -4, 4, -4, 4, 0] : 0,
      }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {/* Success Alert */}
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

        {/* Error Alert */}
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

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
          >
            {t('auth.resetPassword.password')}
          </Label>
          <div className="group relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={success || isLoading}
              className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-white disabled:opacity-50"
              disabled={success || isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
          >
            {t('auth.resetPassword.confirmPassword')}
          </Label>
          <div className="group relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="••••••••"
              required
              disabled={success || isLoading}
              className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-white disabled:opacity-50"
              disabled={success || isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || success}
          className="group relative h-12 w-full overflow-hidden rounded-lg bg-white text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <Spinner size="sm" className="border-black/20 border-t-black" />
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t('auth.resetPassword.submit')}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </Button>

        {/* Status indicator (footer form) */}
        <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[10px] tracking-tighter text-zinc-600 uppercase">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-cyan-500" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-cyan-500" />
            <span>Encrypted</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Spinner size="lg" />
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            Loading...
          </span>
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
